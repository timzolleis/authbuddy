import * as process from 'process';
import type { OauthProvider } from '~/config/internal-auth';
import { EnvRequiredException } from '~/exception/EnvRequiredException';
import * as crypto from 'crypto';
import { redirect } from '@remix-run/node';
import axios from 'axios';
import { DiscordInfoProvider, GithubInfoProvider, GoogleInfoProvider } from '~/utils/auth/userinfo';

export class InternalAuthenticator {
    readonly #provider: OauthProvider;
    readonly #clientId: string;
    readonly #clientSecret: string;
    readonly #redirectUri: string;
    readonly #state: string;

    constructor(provider: OauthProvider) {
        const envProviderName = provider.name.toUpperCase();
        const clientId = process.env[`${envProviderName}_CLIENT_ID`];
        const clientSecret = process.env[`${envProviderName}_CLIENT_SECRET`];
        if (!clientId) {
            throw new EnvRequiredException(`${envProviderName}_CLIENT_ID`);
        }
        if (!clientSecret) {
            throw new EnvRequiredException(`${envProviderName}_CLIENT_SECRET`);
        }
        //Assign variables
        this.#provider = provider;
        this.#clientId = clientId;
        this.#clientSecret = clientSecret;
        this.#redirectUri = this.getRedirectUri();
        this.#state = this.generateState();
    }

    private getRedirectUri() {
        const applicationUrl = process.env.APPLICATION_URL;
        if (!applicationUrl) {
            throw new EnvRequiredException('APPLICATION_URL');
        }
        return `${applicationUrl}/internal/auth/${this.#provider.name.toLowerCase()}/callback`;
    }

    private generateState() {
        return crypto.randomBytes(16).toString('hex');
    }

    initialize() {
        const url = new URL(this.#provider.oauth.url);
        url.searchParams.append('client_id', this.#clientId);
        url.searchParams.append('redirect_uri', this.#redirectUri);
        url.searchParams.append('response_type', 'code');
        url.searchParams.append('state', this.#state);
        url.searchParams.append('scope', this.#provider.oauth.scope);
        return redirect(url.toString());
    }

    async getAccessToken(code: string) {
        const response = await axios.post(
            this.#provider.oauth.token,
            {
                client_id: this.#clientId,
                client_secret: this.#clientSecret,
                grant_type: 'authorization_code',
                code,
                redirect_uri: this.#redirectUri,
            },
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Accept: 'application/json',
                },
            }
        );
        return response.data?.access_token;
    }

    async getUserInformation(accessToken: string) {
        const providerActions = {
            github: function () {
                const informationProvider = new GithubInfoProvider();
                return informationProvider.getUserInformation(accessToken);
            },
            google: function () {
                const informationProvider = new GoogleInfoProvider();
                return informationProvider.getUserInformation(accessToken);
            },
            discord: function () {
                const informationProvider = new DiscordInfoProvider();
                return informationProvider.getUserInformation(accessToken);
            },
        };
        const key = this.#provider.name.toLowerCase();
        const action = providerActions[key as keyof typeof providerActions];
        if (action) return action();
    }
}
