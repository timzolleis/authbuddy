import axios, { AxiosInstance } from 'axios';

const baseUrl = 'https://valorant-api.com/v1';

export class ValorantApiClient {
    client: AxiosInstance;
    constructor(client: AxiosInstance) {
        this.client = axios.create({ baseURL: baseUrl });
    }
}
