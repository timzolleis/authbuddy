import { Form, Link, NavLink, Outlet, V2_MetaFunction } from '@remix-run/react';
import { Tab, TabList, TextInput } from '@tremor/react';
import { Button } from '~/ui/components/button/Button';
import {
    AccessTokenResponse,
    MultifactorResponse,
    requestAccessToken,
    requestAuthCookies,
} from '~/utils/auth/riot/auth.server';
import { DataFunctionArgs, redirect } from '@remix-run/node';
import { requireFormDataField } from '~/utils/form/formdata.server';
import { useState } from 'react';
import { EyeIcon } from '~/ui/icons/EyeIcon';
import { ClosedEyeIcon } from '~/ui/icons/ClosedEyeIcon';

export const meta: V2_MetaFunction = () => {
    return [{ title: 'AuthBuddy | Login' }];
};

function requiresMultifactor(
    response: AccessTokenResponse | MultifactorResponse
): response is MultifactorResponse {
    return response.requiresMultifactor;
}

export const action = async ({ request, params }: DataFunctionArgs) => {
    const formData = await request.formData();
    const username = requireFormDataField(formData, 'username');
    const password = requireFormDataField(formData, 'password');
    const cookies = await requestAuthCookies();
    if (!cookies) {
        throw new Error('There was an error requesting auth cookies');
    }
    const response = await requestAccessToken({ username: username, password, cookies });
    if (requiresMultifactor(response)) {
        return redirect(
            `/login/multifactor?length=${response.response.multifactor.multiFactorCodeLength}&asid=${response.asid}&clid=${response.clid}&email=${response.response.multifactor.email}`
        );
    }

    return null;
};

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <Form method={'POST'} className={'mt-2 space-y-3'}>
            <p className={'text-title-medium font-bold'}>Sign in to your account</p>
            <TextInput
                required={true}
                name={'username'}
                placeholder={'Username...'}
                className={'border-white/30 bg-neutral-900 hover:bg-neutral-800'}
            />
            <span className={'flex items-center gap-2'}>
                <TextInput
                    type={showPassword ? 'text' : 'password'}
                    required={true}
                    name={'password'}
                    placeholder={'Password...'}
                    className={'border-white/30 bg-neutral-900 hover:bg-neutral-800'}
                />
                {showPassword ? (
                    <EyeIcon onClick={() => setShowPassword(!showPassword)} />
                ) : (
                    <ClosedEyeIcon onClick={() => setShowPassword(!showPassword)} />
                )}
            </span>
            <span className={'flex items-center gap-2'}>
                <input
                    name={'remember_me'}
                    type='checkbox'
                    className={
                        'h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600'
                    }
                />
                <p>Remember me</p>
            </span>
            <div className={'grid gap-2'}>
                <Button padding={'medium'} width={'full'} font={'medium'}>
                    Sign in
                </Button>
                <Link to={'/login/developer'}>
                    <Button color={'secondary'} padding={'medium'} width={'full'} font={'medium'}>
                        Sign up as developer
                    </Button>
                </Link>
            </div>
        </Form>
    );
};

export default LoginPage;
