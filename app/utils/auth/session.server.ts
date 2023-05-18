import { createCookieSessionStorage, redirect, Session } from '@remix-run/node';
import * as process from 'process';
import { EnvRequiredException } from '~/exception/EnvRequiredException';
import { User } from '~/utils/auth/user.server';
import { environmentVariables } from '~/utils/env.server';
import { red } from 'kleur/colors';

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
    return getSession(request.headers.get('Cookie'));
}

export async function commitLoginSession(session: Session) {
    return commitSession(session);
}

export async function getUser(request: Request): Promise<User | undefined> {
    const session = await getLoginSession(request);
    return session.get('user');
}

export async function setUser(request: Request, user: User) {
    const session = await getLoginSession(request);
    session.set('user', user);
    return commitSession(session);
}

export async function getPlayer(request: Request): Promise<User | undefined> {
    const session = await getLoginSession(request);
    return session.get('player');
}

export async function setPlayer(request: Request, user: User) {
    const session = await getLoginSession(request);
    session.set('player', user);
    return commitSession(session);
}

export async function destroyUserSession(request: Request) {
    const session = await getLoginSession(request);
    return destroySession(session);
}

export async function requireDeveloper(request: Request) {
    const user = await getUser(request);
    if (!user || user?.role !== 'DEVELOPER') {
        throw redirect('/login/developer');
    }
    return user;
}

export async function requirePlayer(request: Request) {
    const player = await getPlayer(request);
    if (!player) {
        throw redirect('/login');
    }
    return player;
}
