import { DataFunctionArgs, redirect } from '@remix-run/node';
import { internalAuthConfiguration } from '~/config/internal-auth';
import { InternalAuthenticator } from '~/utils/auth/oauth.server';
import { Button } from '~/components/ui/Button';
import { Link, Params } from '@remix-run/react';
import { DangerIcon } from '~/components/icons/DangerIcon';

function hasProvider(
    providerName: string
): providerName is keyof typeof internalAuthConfiguration.providers {
    return providerName in internalAuthConfiguration.providers;
}

export function getProviderFromParam(params: Params) {
    const providerName = params.provider;
    if (!providerName) {
        throw new Error('Provider missing');
    }
    if (!hasProvider(providerName)) {
        throw new Error('Unavailable Provider');
    }
    return new InternalAuthenticator(internalAuthConfiguration.providers[providerName]);
}

//This component is responsible for redirecting the user to the correct authenticating party

export const loader = async ({ request, params }: DataFunctionArgs) => {
    const providerName = params.provider;
    if (!providerName) {
        throw redirect('/login');
    }
    if (!hasProvider(providerName)) {
        throw redirect('/login');
    }
    const authenticator = new InternalAuthenticator(
        internalAuthConfiguration.providers[providerName]
    );
    return authenticator.initialize();
};

const AuthProviderPage = () => {
    return <p>Auth Page</p>;
};
export const ErrorBoundary = () => {
    return (
        <main className={'mt-10 flex justify-center'}>
            <section className={'lg: w-1/2 rounded border border-white/30 p-5 lg:p-10'}>
                <span className={'flex items-center gap-2'}>
                    <DangerIcon size={'sm'} />
                    <h1 className={'text-headline-medium font-bold'}>
                        Authentication provider not available
                    </h1>
                </span>
                <p className={'text-sm text-neutral-300'}>
                    The authentication provider you chose is not available at the moment. Please
                    choose another one, or if you believe this to be a bug, please open an issue on
                    GitHub.
                </p>
                <div className={'mt-3 flex w-full items-center gap-2'}>
                    <Link to={'/login/developer'}>
                        <Button>Choose other signin method</Button>
                    </Link>
                    <Link to={'https://github.com/buddyverse/authbuddy/issues/new'}>
                        <Button color={'secondary'} external={true}>
                            Open Issue on GitHub
                        </Button>
                    </Link>
                </div>
            </section>
        </main>
    );
};

export default AuthProviderPage;
