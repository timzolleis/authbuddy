import * as process from 'process';
import type { OauthProvider } from '~/config/internal-auth';
import { EnvRequiredException } from '~/exception/EnvRequiredException';
import * as crypto from 'crypto';
import { redirect } from '@remix-run/node';

export class InternalAuthenticator {
    #provider: OauthProvider;
    readonly #clientId: string;
    #clientSecret: string;
    readonly #redirectUri: string;
    #state: string;

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
        return encodeURIComponent(
            `${applicationUrl}/internal/auth/${this.#provider.name.toLowerCase()}/callback`
        );
    }

    private generateState() {
        return crypto.randomBytes(16).toString('hex');
    }

    initialize() {
        const redirectionString = `${this.#provider.oauth.url}?client_id=${
            this.#clientId
        }&redirect_uri=${this.#redirectUri}&response_type=code&state=${this.#state}`;
        return redirect(redirectionString);
    }
}
