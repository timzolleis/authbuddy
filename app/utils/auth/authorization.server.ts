import { AuthorizationRequest } from '~/routes/authorize';
import { User } from '~/utils/auth/user.server';
import { DateTime } from 'luxon';
import * as jose from 'jose';
import { environmentVariables } from '~/utils/env.server';
import { createSecretKey } from 'crypto';
import { Simulate } from 'react-dom/test-utils';
import playing = Simulate.playing;

export function getSearchParamsFromAuthorizationRequest(
    authorizationRequest: AuthorizationRequest
) {
    const keys = Object.keys(authorizationRequest).filter((key) => key !== 'request_start');
    const searchParams = keys.map((key) => {
        return {
            key: key,
            value: authorizationRequest[key as keyof typeof authorizationRequest]?.toString(),
        };
    });
    //Typescript not smart enough to infer filtered type, have to typecast here
    return searchParams.filter((searchParam) => searchParam.value) as {
        key: string;
        value: string;
    }[];
}

export async function generateAuthorizationCode(
    authorizationRequest: AuthorizationRequest,
    user: User
) {
    const key = createSecretKey(new TextEncoder().encode(environmentVariables.JWT_ENCRYPTION_KEY));

    const jwtContent = {
        user: user.id,
        application: authorizationRequest.applicationId,
    };
    return new jose.EncryptJWT(jwtContent)
        .setProtectedHeader({ alg: 'dir', enc: 'A256CBC-HS512' })
        .setIssuedAt()
        .setExpirationTime('10min')
        .encrypt(key);
}

export async function decryptAuthorizationCode(code: string) {
    const key = createSecretKey(new TextEncoder().encode(environmentVariables.JWT_ENCRYPTION_KEY));
    return await jose.jwtDecrypt(code, key);
}
