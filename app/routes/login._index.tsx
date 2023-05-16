import { Form, Link, useNavigation, V2_MetaFunction } from '@remix-run/react';
import { Button, buttonVariants } from '~/components/ui/Button';
import {
    AccessTokenResponse,
    MultifactorResponse,
    requestAccessToken,
    requestAuthCookies,
} from '~/utils/auth/riot/auth.server';
import { DataFunctionArgs, redirect } from '@remix-run/node';
import { requireFormDataField } from '~/utils/form/formdata.server';
import { PasswordInput } from '~/components/ui/PasswordInput';
import { Input } from '~/components/ui/Input';
import { Checkbox } from '~/components/ui/Checkbox';
import { Label } from '~/components/ui/Label';
import { Loader2 } from 'lucide-react';

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
    const rememberMe = !!formData.get('remember_me');
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
    const loading = useNavigation().state !== 'idle';
    return (
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 '>
            <div className='flex flex-col space-y-2 text-center'>
                <h1 className='text-2xl font-semibold tracking-tight'>Welcome back</h1>
                <p className='text-sm text-muted-foreground'>Sign in with your VALORANT account.</p>
            </div>
            <Form method={'POST'} className={'flex w-full flex-col gap-2'}>
                <Input required={true} name={'username'} placeholder={'Username...'} />
                <PasswordInput required={true} name={'password'} placeholder={'Password...'} />
                <div className={'flex items-center gap-2'}>
                    <Checkbox name={'remember_me'} />
                    <Label>Remember me</Label>
                </div>
                <Button className={'mt-2 w-full'}>
                    {loading && <Loader2 className={'animate-spin'} size={18} />}
                    {loading ? 'Signing you in...' : 'Sign in'}
                </Button>
                <div className='relative py-3'>
                    <div className='absolute inset-0 flex items-center'>
                        <span className='w-full border-t' />
                    </div>
                    <div className='relative flex justify-center text-xs uppercase'>
                        <span className='bg-background px-2 text-muted-foreground'>
                            Or sign in as developer
                        </span>
                    </div>
                </div>
                <Link to={'/login/developer'} className={buttonVariants({ variant: 'outline' })}>
                    Sign in as developer
                </Link>
            </Form>
        </div>
    );
};

export default LoginPage;
