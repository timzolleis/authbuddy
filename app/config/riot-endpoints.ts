const PD_URL = 'https://pd.eu.a.pvp.net';

export const riotEndpoints = {
    playerLoadout: (puuid: string) => `${PD_URL}/personalization/v2/players/${puuid}/playerloadout`,
};
