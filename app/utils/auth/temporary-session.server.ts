import { createCookieSessionStorage, Session } from '@remix-run/node';
import { environmentVariables } from '~/utils/env.server';
import { AuthorizationRequest } from '~/routes/authorize';
import { node } from 'prop-types';

const { getSession, commitSession, destroySession } = createCookieSessionStorage({
    cookie: {
        name: 'authbuddy-temporary-session',
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 10, //Session persists for 10 minutes
        secrets: [environmentVariables.APPLICATION_SECRET],
    },
});

export async function getTemporarySession(request: Request) {
    return await getSession(request.headers.get('Cookie'));
}

export async function setAuthorizationRequest(
    nodeRequest: Request,
    authorizationRequest: AuthorizationRequest
) {
    const session = await getTemporarySession(nodeRequest);
    session.set('authorizationRequest', authorizationRequest);
    return commitTemporarySession(session);
}

export async function getAuthorizationRequest(
    nodeRequest: Request
): Promise<AuthorizationRequest | undefined> {
    const session = await getTemporarySession(nodeRequest);
    return session.get('authorizationRequest');
}

export async function commitTemporarySession(session: Session) {
    return commitSession(session);
}

export async function destroyTemporarySession(request: Request) {
    const session = await getTemporarySession(request);
    return destroySession(session);
}
