import { InternalUser } from '~/utils/internal-auth/user.server';
import axios from 'axios';
import { internalAuthConfiguration } from '~/config/internal-auth';
import { GithubUserInformation } from '~/models/auth/internal/github/GithubUserInformationResponse';
import { GoogleUserInformationResponse } from '~/models/auth/internal/google/GoogleUserInformationResponse';
import { DiscordUserInformationResponse } from '~/models/auth/internal/discord/DiscordUserInformationResponse';
import { da } from 'date-fns/locale';

interface UserInfoProvider {
    getUserInformation(accessToken: string): Promise<InternalUser>;
}

class InfoProvider {
    async fetchUserInformation<T>(url: string, accessToken: string) {
        return await axios
            .get<T>(url, {
                headers: { Authorization: `Bearer ${accessToken}` },
            })
            .then((res) => res.data);
    }
}

export class GithubInfoProvider extends InfoProvider implements UserInfoProvider {
    async getUserInformation(accessToken: string): Promise<InternalUser> {
        const url = `${internalAuthConfiguration.providers.github.apiUrl}${internalAuthConfiguration.providers.github.api.user}`;
        const data = await this.fetchUserInformation<GithubUserInformation>(url, accessToken);
        return new InternalUser(data.id.toString(), data.login, data.avatar_url);
    }
}

export class GoogleInfoProvider extends InfoProvider implements UserInfoProvider {
    async getUserInformation(accessToken: string) {
        const url = `${internalAuthConfiguration.providers.google.apiUrl}${internalAuthConfiguration.providers.google.api.user}`;
        const data = await this.fetchUserInformation<GoogleUserInformationResponse>(
            url,
            accessToken
        );
        return new InternalUser(data.sub, data.name, data.picture);
    }
}

export class DiscordInfoProvider extends InfoProvider implements UserInfoProvider {
    async getUserInformation(accessToken: string) {
        const url = `${internalAuthConfiguration.providers.discord.apiUrl}${internalAuthConfiguration.providers.discord.api.user}`;
        const data = await this.fetchUserInformation<DiscordUserInformationResponse>(
            url,
            accessToken
        );
        const avatarUrl = `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`;
        return new InternalUser(data.id, data.username, avatarUrl);
    }
}
