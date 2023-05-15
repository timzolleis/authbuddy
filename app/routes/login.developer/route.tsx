import { Form, Link, V2_MetaFunction } from '@remix-run/react';
import {
    AvailableProvider,
    internalAuthConfiguration,
    OauthProvider,
} from '~/config/internal-auth';

export const meta: V2_MetaFunction = () => {
    return [{ title: 'AuthBuddy | Developer Login' }];
};

const DeveloperLoginPage = () => {
    const availableProviders = Object.keys(
        internalAuthConfiguration.providers
    ) as AvailableProvider[];
    return (
        <Form className={'mt-2 space-y-3'}>
            <p className={'text-center text-headline-medium font-bold'}>Sign in to AuthBuddy Dev</p>
            <div className={'flex flex-col gap-2'}>
                {availableProviders.map((provider) => (
                    <OauthComponent
                        key={provider}
                        provider={internalAuthConfiguration.providers[provider]}></OauthComponent>
                ))}
            </div>
        </Form>
    );
};

const OauthComponent = ({ provider }: { provider: OauthProvider }) => {
    return (
        <Link to={`/internal/auth/${provider.name.toLowerCase()}`}>
            <div
                className={
                    'flex items-center justify-center gap-3 rounded-md border border-white/30 bg-neutral-900 px-5 py-4 md:py-3'
                }>
                <img
                    className={'w-5'}
                    src={`/resources/img/logos/auth-providers/${provider.name.toLowerCase()}.png`}
                    alt=''
                />
                <div>
                    Sign in with <span className={'font-semibold'}>{provider.name}</span>
                </div>
            </div>
        </Link>
    );
};

export default DeveloperLoginPage;
