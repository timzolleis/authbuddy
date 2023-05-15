import axios from 'axios';
import { internalAuthConfiguration } from '~/config/internal-auth';
import { GithubUserInformation } from '~/types/auth/internal/github/GithubUserInformationResponse';
import { GoogleUserInformationResponse } from '~/types/auth/internal/google/GoogleUserInformationResponse';
import { DiscordUserInformationResponse } from '~/types/auth/internal/discord/DiscordUserInformationResponse';
import { User } from '~/utils/auth/user.server';

interface UserInfoProvider {
    getUserInformation(accessToken: string): Promise<User>;
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
    async getUserInformation(accessToken: string): Promise<User> {
        const url = `${internalAuthConfiguration.providers.github.apiUrl}${internalAuthConfiguration.providers.github.api.user}`;
        const data = await this.fetchUserInformation<GithubUserInformation>(url, accessToken);
        return new User(data.id.toString(), data.login, data.avatar_url, 'DEVELOPER');
    }
}

export class GoogleInfoProvider extends InfoProvider implements UserInfoProvider {
    async getUserInformation(accessToken: string) {
        const url = `${internalAuthConfiguration.providers.google.apiUrl}${internalAuthConfiguration.providers.google.api.user}`;
        const data = await this.fetchUserInformation<GoogleUserInformationResponse>(
            url,
            accessToken
        );
        return new User(data.sub, data.name, data.picture, 'DEVELOPER');
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
        return new User(data.id, data.username, avatarUrl, 'DEVELOPER');
    }
}
