import { getLoginClient } from '~/utils/auth/riot/client.server';
import { easePoly } from 'd3-ease';
import { getMultifactorCookies } from '~/utils/auth/riot/cookies.server';
import { encryptString } from '~/utils/encryption/encryption';
import { cli } from '@remix-run/dev';
import { asyncScheduler } from 'rxjs';
import { backIn } from 'framer-motion';
import { User } from '~/utils/auth/user.server';

type AuthType = 'multifactor' | 'response';

export interface AuthResponse {
    requiresMultifactor: boolean;
}

export interface AccessTokenResponse extends AuthResponse {
    accessToken: string;
}

export interface MultifactorResponse extends AuthResponse {
    response: ValorantAuthenticationMultifactorResponse;
    asid: string;
    clid: string;
}

interface Parameters {
    uri: string;
}

interface Response {
    mode: string;
    parameters: Parameters;
}

interface ValorantAuthenticationTokenResponse {
    type: AuthType;
    response: Response;
    country: string;
}

interface Multifactor {
    email: string;
    method: string;
    methods: string[];
    multiFactorCodeLength: number;
    mfaVersion: string;
}

interface ValorantAuthenticationMultifactorResponse {
    type: AuthType;
    multifactor: Multifactor;
    country: string;
    securityProfile: string;
}

export interface Pw {
    cng_at: number;
    reset: boolean;
    must_reset: boolean;
}

export interface Acct {
    type: number;
    state: string;
    adm: boolean;
    game_name: string;
    tag_line: string;
    created_at: number;
}

export interface Affinity {
    pp: string;
}

export interface RSOUserInfo {
    country: string;
    sub: string;
    email_verified: boolean;
    player_plocale?: any;
    country_at: number;
    pw: Pw;
    phone_number_verified: boolean;
    account_verified: boolean;
    ppid?: any;
    player_locale: string;
    acct: Acct;
    age: number;
    jti: string;
    affinity: Affinity;
}

export interface ValorantEntitlementsResponse {
    entitlements_token: string;
}

const authUrl = 'https://auth.riotgames.com';

export async function requestAuthCookies() {
    const client = await getLoginClient(authUrl);
    const response = await client.post('/api/v1/authorization', {
        client_id: 'play-valorant-web-prod',
        nonce: 1,
        redirect_uri: 'https://playvalorant.com/opt_in',
        response_type: 'token id_token',
        scope: 'account openid',
    });
    const cookieHeaders = response.headers['set-cookie'];
    return cookieHeaders?.filter((c) => c.startsWith('asid') || c.startsWith('tdid'));
}

export async function requestAccessToken({
    username,
    password,
    cookies,
}: {
    username: string;
    password: string;
    cookies: string[];
}) {
    const client = await getLoginClient(authUrl);
    const response = await client.put<
        ValorantAuthenticationTokenResponse | ValorantAuthenticationMultifactorResponse
    >(
        '/api/v1/authorization',
        {
            type: 'auth',
            username,
            password,
            remember: true,
            language: 'en_US',
        },
        {
            headers: {
                Cookie: cookies.join('; '),
            },
        }
    );
    if (requiresMultifactorAuthentication(response.data)) {
        const cookies = getMultifactorCookies(response.headers['set-cookie']);
        const asid = cookies.get('asid');
        const clid = cookies.get('clid');
        if (!clid || !asid) {
            throw new Error('Expected cookies are not present in response');
        }
        const encryptedAsid = encryptString(asid);
        const encryptedClid = encryptString(clid);
        return {
            requiresMultifactor: true,
            response: response.data,
            asid: encryptedAsid,
            clid: encryptedClid,
        };
    }
    return {
        requiresMultifactor: false,
        accessToken: parseToken(response.data.response.parameters.uri),
    };
}

export async function requestAccessTokenWithMultifactorCode({
    code,
    cookies,
}: {
    code: string;
    cookies: string[];
}) {
    const client = await getLoginClient(authUrl);
    const response = await client.put<ValorantAuthenticationTokenResponse>(
        '/api/v1/authorization',
        {
            type: 'multifactor',
            code,
            rememberDevice: true,
        },
        {
            headers: {
                Cookie: cookies.join('; '),
            },
        }
    );
    return {
        accessToken: parseToken(response.data.response.parameters.uri),
    };
}

async function requestEntitlementsToken(accessToken: string) {
    const client = await getLoginClient(authUrl);
    const response = await client.post<ValorantEntitlementsResponse>(
        '/api/token/v1',
        {},
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );
    return response.data.entitlements_token;
}

function parseToken(uri: string) {
    const url = new URL(uri);
    const params = new URLSearchParams(url.hash.substring(1));
    const accessToken = params.get('access_token');
    if (!accessToken) {
        throw new Error('No access token present in response');
    }
    return accessToken;
}

export function requiresMultifactorAuthentication(
    res: ValorantAuthenticationTokenResponse | ValorantAuthenticationMultifactorResponse
): res is ValorantAuthenticationMultifactorResponse {
    return res.type === 'multifactor';
}

export async function setRiotUser(accessToken: string) {}

async function requestUserData(accessToken: string) {
    const client = await getLoginClient(authUrl);
    const response = await client.get<RSOUserInfo>('/userinfo', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
}
