import axios from 'axios';
import { ValorantApiResponse } from '~/types/valorant-api/valorant-api-response';
import { ValorantApiVersion } from '~/types/valorant-api/valorant-api-version';

const baseURL = 'https://valorant-api.com/v1';

function getClient() {
    return axios.create({ baseURL });
}

export async function getVersion() {
    const client = getClient();
    return client
        .get<ValorantApiResponse<ValorantApiVersion>>('/version')
        .then((res) => res.data.data);
}

export async function getPlayerCard(playerCardUuid: string) {
    return getClient().get<ValorantApiResponse<ValorantApiPlayercard>>(
        `/playercards/${playerCardUuid}`
    );
}
