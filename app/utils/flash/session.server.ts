import { createCookieSessionStorage, redirect, Session } from '@remix-run/node';
import * as process from 'process';
import { EnvRequiredException } from '~/exception/EnvRequiredException';
import { User } from '~/utils/auth/user.server';

if (!process.env.APPLICATION_SECRET) {
    throw new EnvRequiredException('APPLICATION_SECRET');
}

const { getSession, commitSession, destroySession } = createCookieSessionStorage({
    cookie: {
        name: 'authbuddy-session',
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, //30 day login
        secrets: [process.env.APPLICATION_SECRET],
    },
});

export async function getAuthbuddySession(request: Request) {
    return await getSession(request.headers.get('Cookie'));
}
export async function commitAuthbuddySession(session: Session) {
    return await commitSession(session);
}
