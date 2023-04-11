import { Form, Link, V2_MetaFunction } from '@remix-run/react';
import { Button } from '~/ui/components/button/Button';

type OauthProvider = 'github' | 'discord';

export const meta: V2_MetaFunction = () => {
    return [{ title: 'AuthBuddy | Developer Login' }];
};

const DeveloperLoginPage = () => {
    return (
        <Form className={'mt-2 space-y-3'}>
            <p className={'text-title-medium font-bold'}>Sign in to your developer account</p>
        </Form>
    );
};

const OauthComponent = ({ provider, name }: { provider: string; name: string }) => {
    return <div>{name}</div>;
};

export default DeveloperLoginPage;
