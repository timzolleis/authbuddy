import { createCookieSessionStorage, redirect, Session } from '@remix-run/node';
import * as process from 'process';
import { EnvRequiredException } from '~/exception/EnvRequiredException';
import { User } from '~/utils/auth/user.server';
import { environmentVariables } from '~/utils/env.server';

const { getSession, commitSession, destroySession } = createCookieSessionStorage({
    cookie: {
        name: 'authbuddy-authentication',
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, //30 day login
        secrets: [environmentVariables.APPLICATION_SECRET],
    },
});

export async function getLoginSession(request: Request) {
    return await getSession(request.headers.get('Cookie'));
}
export async function commitLoginSession(session: Session) {
    return await commitSession(session);
}

export async function getUser(request: Request): Promise<User | undefined> {
    const session = await getLoginSession(request);
    return session.get('user');
}

export async function setUser(request: Request, user: User) {
    const session = await getLoginSession(request);
    session.set('user', user);
    return await commitSession(session);
}

export async function destroyInternalUser(request: Request) {
    const session = await getLoginSession(request);
    return await destroySession(session);
}

export async function requireDeveloper(request: Request) {
    const user = await getUser(request);
    if (!user || user?.role !== 'DEVELOPER') {
        throw redirect('/login/developer');
    }
    return user;
}
