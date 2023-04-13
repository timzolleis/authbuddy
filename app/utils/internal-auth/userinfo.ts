import {InternalUser} from "~/utils/internal-auth/user.server";
import axios from "axios";
import {internalAuthConfiguration} from "~/config/internal-auth";
import {GithubUserInformation} from "~/models/auth/internal/github/GithubUserInformationResponse";

interface UserInfoProvider {
    getUserInformation(accessToken: string): Promise<InternalUser>
}

export class GithubInfoProvider implements UserInfoProvider {
    async getUserInformation(accessToken: string) {
        const information = await axios.get<GithubUserInformation>(`${internalAuthConfiguration.providers.github.apiUrl}${internalAuthConfiguration.providers.github.api.user}`, {
            headers: {Authorization: `Bearer ${accessToken}`},
        }).then(res => res.data);
        return new InternalUser(information.id.toString(), information.login, information.avatar_url)
    }
}

