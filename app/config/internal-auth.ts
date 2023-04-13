export type AvailableProvider = keyof (typeof internalAuthConfiguration)['providers'];
export type OauthProvider = (typeof internalAuthConfiguration)['providers'][AvailableProvider];

export const internalAuthConfiguration = {
    providers: {
        github: {
            name: 'GitHub',
            apiUrl: 'https://api.github.com',
            api: {
                user: '/user',
            },
            oauth: {
                url: 'https://github.com/login/oauth/authorize',
                token: 'https://github.com/login/oauth/access_token',
            },
        },
        discord: {
            name: 'Discord',
            apiUrl: 'https://api.github.com',
            api: {
                user: '/user',
            },
            oauth: {
                url: 'https://discord.com/oauth2/authorize',
                token: 'https://discord.com/oauth2/token',
            },
        },
        google: {
            name: 'Google',
            apiUrl: 'https://api.github.com',
            api: {
                user: '/user',
            },
            oauth: {
                url: 'https://accounts.google.com/o/oauth2/v2/auth',
                token: 'https://www.googleapis.com/oauth2/v4/token',
            },
        },
    },
};
