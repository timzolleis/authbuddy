import { get } from '@vercel/edge-config';
import { ApplicationConfigException } from '~/exception/ApplicationConfigException';
import * as https from 'https';
import axios, { AxiosHeaders } from 'axios';

type Ciphers = string[] | undefined;
type RiotConfig =
    | {
          clientPlatform: {
              platformType: string;
              platformOS: string;
              platformOSVersion: string;
              platformChipset: string;
          };
          riotClientVersion: string;
          ciphers: Ciphers;
          riotClientBuild: string;
      }
    | undefined;

export async function getLoginClient() {
    return axios.create({
        httpAgent: await getAgent(),
        httpsAgent: await getAgent(),
        headers: { ...(await getHeaders()) },
    });
}

async function getAgent() {
    const ciphers = (await get('riotConfig.ciphers')) as Ciphers;
    if (!ciphers) {
        throw new ApplicationConfigException('There was an error reading ciphers from edge config');
    }
    return new https.Agent({
        ciphers: ciphers.join(':'),
        honorCipherOrder: true,
        minVersion: 'TLSv1.2',
    });
}

async function getHeaders() {
    const config = (await get('riotConfig')) as RiotConfig;
    if (!config) {
        throw new ApplicationConfigException(
            'There was an error reading riot config from edge config'
        );
    }
    return {
        'content-type': 'application/json',
        'user-agent': `RiotClient/${config.riotClientBuild} rso-auth (Windows;10;;Professional, x64)`,
        'X-Riot-ClientVersion': config.riotClientVersion,
        'X-Riot-ClientPlatform': Buffer.from(JSON.stringify(config.clientPlatform)).toString(
            'base64'
        ),
    };
}
