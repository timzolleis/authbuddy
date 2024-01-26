import { DataFunctionArgs, Headers, json, redirect } from '@remix-run/node';
import { requiredSearchParams } from '~/config/oauth-config';
import { Form, Link, useLoaderData, useNavigation, useRouteError } from '@remix-run/react';
import { ErrorContainer } from '~/components/ui/ErrorContainer';
import { prisma } from '~/utils/prisma/prisma.server';
import {
    destroyTemporarySession,
    getAuthorizationRequest,
    setAuthorizationRequest,
} from '~/utils/auth/temporary-session.server';
import { DateTime } from 'luxon';
import { destroyUserSession, getPlayer, requirePlayer } from '~/utils/auth/session.server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/Card';
import { Button } from '~/components/ui/Button';
import { requireResult } from '~/utils/general-utils.server';
import { generateAuthorizationCode } from '~/utils/auth/authorization.server';
import { Loader2 } from 'lucide-react';

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

function validateAuthorizationRequest(authorizationRequest: AuthorizationRequest | undefined) {
    if (authorizationRequest) {
        return (
            DateTime.fromSeconds(authorizationRequest.request_start)
                .diff(DateTime.now())
                .as('minutes') <= 10
        );
    }
    return false;
}

export const action = async ({ request }: DataFunctionArgs) => {
    const authorizationRequest = await getAuthorizationRequest(request);
    if (!validateAuthorizationRequest(authorizationRequest) || !authorizationRequest) {
        throw new Error('Invalid authorization request');
    }
    const intent = await request.formData().then((formData) => formData.get('intent'));
    const application = await prisma.application
        .findUnique({ where: { id: authorizationRequest?.applicationId } })
        .then((result) => requireResult(result));
    if (intent === 'cancel') {
        return redirect(application.redirectUrl, {
            headers: { 'Set-Cookie': await destroyTemporarySession(request) },
        });
    }
    if (intent === 'authorize') {
        const user = await requirePlayer(request);
        const code = await generateAuthorizationCode(authorizationRequest, user);
        const redirectionUrl = new URL(application.redirectUrl);
        redirectionUrl.searchParams.append('code', code);
        if (authorizationRequest.state) {
            redirectionUrl.searchParams.append('state', authorizationRequest.state);
        }
        return redirect(redirectionUrl.toString(), {
            headers: {
                'Set-Cookie': await destroyTemporarySession(request),
            },
        });
    }
    return null;
};

const AuthorizationPage = () => {
    const { application } = useLoaderData<typeof loader>();
    const navigation = useNavigation();
    const isAuthorizationLoading = navigation.formData?.get('intent') === 'authorize';
    const isCancellationLoading = navigation.formData?.get('intent') === 'cancel';

    return (
        <div className={'mt-5 flex w-full flex-col items-center gap-6 rounded-xl'}>
            <img
                className={'h-24 w-24 rounded-full'}
                src={application.imageUrl ?? undefined}
                alt=''
            />
            <div className={'text-center'}>
                <p className={'text-2xl font-semibold tracking-tight'}>
                    Authorize <span className={'text-primary'}>{application.name}</span>
                </p>
                <p className={'text-sm'}>
                    Authorize {application.name} to perform actions on your behalf.
                </p>
            </div>
            <Card className={'w-full max-w-xl'}>
                <CardHeader>
                    <CardTitle>{application.name}</CardTitle>
                    <CardDescription>{application.description}</CardDescription>
                </CardHeader>
                <CardContent className={'grid gap-2'}>
                    <p className={'mt-2 text-base font-medium text-white'}>
                        The following permissions will be granted to {application.name}:
                    </p>
                    <div className={'list-disc text-sm'}>
                        <li>View your competitive history and your match performance</li>
                        <li>View and update your ingame loadout</li>
                        <li>View your ingame store</li>
                        <li>View your contract progression</li>
                        <li>Make requests to RiotGames on your behalf.</li>
                    </div>
                    <p className={'text-sm text-muted-foreground'}>
                        You can read more about permissions in our{' '}
                        <Link className={'font-medium text-primary'} to={'/faq'}>
                            FAQ
                        </Link>
                    </p>
                    <Form className={'mt-5 flex justify-between gap-2'} method={'POST'}>
                        <Button
                            name={'intent'}
                            value={'cancel'}
                            className={'w-full'}
                            variant={'secondary'}>
                            {isCancellationLoading && (
                                <Loader2 size={18} className={'animate-spin'}></Loader2>
                            )}
                            Cancel
                        </Button>
                        <Button name={'intent'} value={'authorize'} className={'w-full'}>
                            {isAuthorizationLoading && (
                                <Loader2 size={18} className={'animate-spin'}></Loader2>
                            )}
                            Authorize {application.name}
                        </Button>
                    </Form>
                    <p className={'text-sm text-muted-foreground'}>
                        You will be redirected to{' '}
                        <span className={'font-medium'}>{application.redirectUrl}</span>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
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
