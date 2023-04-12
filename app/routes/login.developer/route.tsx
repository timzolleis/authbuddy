import { Form, Link, V2_MetaFunction } from '@remix-run/react';
import { Button } from '~/ui/components/button/Button';
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
            <p className={'text-title-medium font-bold'}>Sign in to your developer account</p>
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
                    'flex items-center gap-5 rounded border border-white/30 bg-neutral-900 px-5 py-3'
                }>
                <div className={'flex-[0_0_5%]'}>
                    <img
                        className={'w-5'}
                        src={`/resources/img/logos/auth-providers/${provider.name.toLowerCase()}.png`}
                        alt=''
                    />
                </div>
                <div>
                    Sign in with <span className={'font-semibold'}>{provider.name}</span>
                </div>
            </div>
        </Link>
    );
};

export default DeveloperLoginPage;
