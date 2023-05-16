import { DataFunctionArgs, json } from '@remix-run/node';
import { getVersion } from '~/utils/valorant-api/valorant-api-version.server';
import { getConfig } from '~/utils/auth/riot/client.server';
import { getEdgeConfigs, updateEdgeConfigItem } from '~/utils/vercel/update-edge-config.server';

export const loader = async ({ request }: DataFunctionArgs) => {
    try {
        const version = await getVersion();
        const edgeConfigs = await getEdgeConfigs();
        const buddyVerseEdgeConfig = edgeConfigs.data.find(
            (config) => config.slug === 'buddyverse'
        );
        if (!buddyVerseEdgeConfig) {
            throw new Error('Error reading edge configs: buddyverse edge config not found');
        }
        const config = await getConfig();
        const updatedConfig = {
            ...config,
            riotClientBuild: version.riotClientBuild,
            riotClientVersion: version.riotClientVersion,
        };
        await updateEdgeConfigItem({
            edgeConfigId: buddyVerseEdgeConfig.id,
            item: { key: 'riotConfig', value: updatedConfig },
        });
        return json({ message: 'Updated edge config successfully' }, { status: 200 });
    } catch (e) {
        return json({
            message: 'Error updating edge config',
            error: e instanceof Error ? e.message : 'UNKNOWN_ERROR',
        });
    }
};
