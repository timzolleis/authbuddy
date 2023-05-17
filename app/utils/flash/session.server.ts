import { createCookieSessionStorage, Session } from '@remix-run/node';
import * as process from 'process';
import { EnvRequiredException } from '~/exception/EnvRequiredException';
import { environmentVariables } from '~/utils/env.server';

const { getSession, commitSession, destroySession } = createCookieSessionStorage({
    cookie: {
        name: 'authbuddy-session',
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, //30 day login
        secrets: [environmentVariables.APPLICATION_SECRET],
    },
});

export async function getAuthbuddySession(request: Request) {
    return await getSession(request.headers.get('Cookie'));
}

export async function commitAuthbuddySession(session: Session) {
    return await commitSession(session);
}
