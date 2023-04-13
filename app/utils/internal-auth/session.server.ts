import { createCookieSessionStorage } from '@remix-run/node';
import * as process from 'process';
import { EnvRequiredException } from '~/exception/EnvRequiredException';
import { InternalUser } from '~/utils/internal-auth/user.server';

if (!process.env.APPLICATION_SECRET) {
    throw new EnvRequiredException('APPLICATION_SECRET');
}

const { getSession, commitSession, destroySession } = createCookieSessionStorage({
    cookie: {
        name: 'authbuddy-internal-authentication',
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, //30 day login
        secrets: [process.env.APPLICATION_SECRET],
    },
});

export async function getInternalLoginSession(request: Request) {
    return await getSession(request.headers.get('Cookie'));
}

export async function getInternalUser(request: Request): Promise<InternalUser | undefined> {
    const session = await getInternalLoginSession(request);
    return session.get('internal-user');
}

export async function setInternalUser(request: Request, user: InternalUser) {
    const session = await getInternalLoginSession(request);
    session.set('internal-user', user);
    return await commitSession(session);
}

export async function destroyInternalUser(request: Request) {
    const session = await getInternalLoginSession(request);
    return await destroySession(session);
}
