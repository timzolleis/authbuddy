import { Form, Link, NavLink, Outlet, V2_MetaFunction } from '@remix-run/react';
import { Tab, TabList, TextInput } from '@tremor/react';
import { Button } from '~/ui/components/button/Button';
export const meta: V2_MetaFunction = () => {
    return [{ title: 'AuthBuddy | Login' }];
};

const LoginPage = () => {
    return (
        <Form className={'mt-2 space-y-3'}>
            <p className={'text-title-medium font-bold'}>Sign in to your account</p>
            <TextInput
                name={'username'}
                placeholder={'Username...'}
                className={'border-white/30 bg-neutral-900 hover:bg-neutral-800'}
            />
            <TextInput
                name={'password'}
                placeholder={'Password...'}
                className={'border-white/30 bg-neutral-900 hover:bg-neutral-800'}
            />
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
