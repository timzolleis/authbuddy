import { DataFunctionArgs, Headers, json, redirect } from '@remix-run/node';
import { requiredSearchParams } from '~/config/oauth-config';
import { useRouteError } from '@remix-run/react';
import { ErrorContainer } from '~/components/ui/ErrorContainer';
import { prisma } from '~/utils/prisma/prisma.server';
import {
    commitTemporarySession,
    getTemporarySession,
    setAuthorizationRequest,
} from '~/utils/auth/temporary-session.server';
import { DateTime } from 'luxon';
import { destroyUserSession, getPlayer, getUser } from '~/utils/auth/session.server';

function parseSearchParams(params: URLSearchParams) {
    const searchParamObject = Object.fromEntries(params);
    return requiredSearchParams.parse(searchParamObject);
}

export type AuthorizationRequest = {
    applicationId: string;
    redirect_uri: string;
    client_id: string;
    state: string | undefined;
    request_start: number;
};
export const loader = async ({ request, params }: DataFunctionArgs) => {
    const searchParams = new URL(request.url).searchParams;
    const parsedSearchParams = parseSearchParams(searchParams);
    const application = await prisma.application
        .findUnique({
            where: {
                clientId_redirectUrl: {
                    clientId: parsedSearchParams.client_id,
                    redirectUrl: parsedSearchParams.redirect_uri,
                },
            },
            include: {
                imageAttribution: true,
            },
        })
        .then((result) => {
            if (!result) {
                throw new Error('No application with provided client_id and redirect_uri found!');
            }
            return result;
        });
    const authorizationRequest: AuthorizationRequest = {
        applicationId: application.id,
        redirect_uri: parsedSearchParams.redirect_uri,
        client_id: parsedSearchParams.client_id,
        state: parsedSearchParams.state,
        request_start: DateTime.now().toSeconds(),
    };
    const player = await getPlayer(request);
    const headers = new Headers();
    headers.append('Set-Cookie', await setAuthorizationRequest(request, authorizationRequest));
    //It should never happen that a player has the role "developer" but we check anyway to prevent any mistakes
    if (!player || player.role === 'DEVELOPER') {
        headers.append('Set-Cookie', await destroyUserSession(request));
        return redirect('/login', {
            headers,
        });
    }
    return json(
        { application },
        {
            headers,
        }
    );
};

export const action = async ({ request, params }: DataFunctionArgs) => {
    return null;
};

const AuthorizationPage = () => {
    return <p>Authorize here</p>;
};

type SerializedZodError = {
    code: string;
    expected: string;
    received: string;
    path: string[];
    message: string;
};

export const ErrorBoundary = () => {
    const error = useRouteError();
    if (error instanceof Error) {
        try {
            const message = JSON.parse(error.message) as Array<SerializedZodError>;
            const errorMessages = message.map((error) => {
                return `The query parameter ${error.path} is ${error.message.toLowerCase()}`;
            });
            return <ErrorContainer errors={errorMessages}></ErrorContainer>;
        } catch (e) {
            return <ErrorContainer errors={[error.message]}></ErrorContainer>;
        }
    } else {
        return <h1>Unknown Error</h1>;
    }
};

export default AuthorizationPage;
