import { get } from '@vercel/edge-config';
import { ApplicationConfigException } from '~/exception/ApplicationConfigException';
import * as https from 'https';
import axios from 'axios';

type Ciphers = string[] | undefined;
type RiotConfig = {
    clientPlatform: {
        platformType: string;
        platformOS: string;
        platformOSVersion: string;
        platformChipset: string;
    };
    riotClientVersion: string;
    ciphers: Ciphers;
    riotClientBuild: string;
};

export async function getConfig() {
    const config = await get<RiotConfig>('riotConfig');
    if (!config) {
        throw new ApplicationConfigException(
            'There was an error reading riot config from edge config'
        );
    }
    return config;
}

export async function getLoginClient(baseUrl?: string) {
    return axios.create({
        baseURL: baseUrl,
        httpAgent: await getAgent(),
        httpsAgent: await getAgent(),
        headers: { ...(await getHeaders()) },
    });
}

export async function getRiotGamesApiClient(
    {
        accessToken,
        entitlementsToken,
    }: {
        accessToken: string;
        entitlementsToken: string;
    },
    baseURL?: string
) {
    return axios.create({
        baseURL,
        httpsAgent: await getAgent(),
        httpAgent: await getAgent(),
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-Riot-Entitlements-JWT': entitlementsToken,
            ...(await getHeaders()),
        },
    });
}

async function getAgent() {
    const config = await getConfig();
    return new https.Agent({
        ciphers: config?.ciphers?.join(':'),
        honorCipherOrder: true,
        minVersion: 'TLSv1.2',
    });
}

async function getHeaders() {
    const config = await getConfig();
    return {
        'content-type': 'application/json',
        'user-agent': `RiotClient/${config.riotClientBuild} rso-auth (Windows;10;;Professional, x64)`,
        'X-Riot-ClientVersion': config.riotClientVersion,
        'X-Riot-ClientPlatform': Buffer.from(JSON.stringify(config.clientPlatform)).toString(
            'base64'
        ),
    };
}
