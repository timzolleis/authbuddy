import { TextInput } from '@tremor/react';
import { Button } from '~/ui/components/button/Button';

const LoginPage = () => {
    return (
        <section className={'mt-5 w-full text-center'}>
            <h2 className={'text-headline-medium font-bold'}>User login</h2>

            <div className={'mt-3 space-y-2'}>
                <TextInput
                    placeholder={'Username'}
                    className={'w-full border-white/50 bg-neutral-900 hover:bg-black'}></TextInput>
                <TextInput
                    placeholder={'Password'}
                    type={'password'}
                    className={'w-full border-white/50 bg-neutral-900 hover:bg-black'}></TextInput>
            </div>
            <div className={'mt-2 flex w-full justify-end'}>
                <Button width={'full'}>Sign in</Button>
            </div>
        </section>
    );
};

export default LoginPage;
