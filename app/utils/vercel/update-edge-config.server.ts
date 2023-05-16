import * as process from 'process';
import { EnvRequiredException } from '~/exception/EnvRequiredException';
import axios from 'axios';
import { EdgeConfig } from '~/types/vercel/edge-config';

const baseURL = 'https://api.vercel.com';

function getClient() {
    const token = process.env.VERCEL_TOKEN;
    if (!token) {
        throw new EnvRequiredException('VERCEL_TOKEN');
    }
    return axios.create({ baseURL, headers: { Authorization: `Bearer ${token}` } });
}

export async function getEdgeConfigs() {
    const client = getClient();
    return client.get<EdgeConfig[]>('/v1/edge-config');
}

type EdgeConfigItem = {
    key: string;
    value: unknown;
};

export async function updateEdgeConfigItem({
    edgeConfigId,
    item,
}: {
    edgeConfigId: string;
    item: EdgeConfigItem;
}) {
    return getClient().patch(`/v1/edge-config/${edgeConfigId}/items`, {
        items: [
            {
                operation: 'upsert',
                ...item,
            },
        ],
    });
}
