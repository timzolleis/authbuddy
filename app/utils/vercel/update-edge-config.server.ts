import axios from 'axios';
import { EdgeConfig } from '~/types/vercel/edge-config';
import { environmentVariables } from '~/utils/env.server';

const baseURL = 'https://api.vercel.com';

function getClient() {
    return axios.create({
        baseURL,
        headers: { Authorization: `Bearer ${environmentVariables.VERCEL_TOKEN}` },
    });
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
