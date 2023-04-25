import { Outlet } from '@remix-run/react';

const LoginPage = () => {
    return (
        <main className={'mt-10 flex flex-col items-center justify-center'}>
            <div className={'flex items-center gap-2'}>
                <img src='/resources/authbuddy_logo.png' className={'h-10'} alt='' />
                <span className={'flex items-center gap-2 rounded bg-red-500 px-3 py-1'}>
                    <p className={'text-headline-large font-bold'}>AuthBuddy</p>
                </span>
            </div>
            <div
                className={
                    'mt-5 w-full rounded-lg border border-white/30 bg-neutral-800 p-5 md:p-10 lg:w-1/2'
                }>
                <Outlet />
            </div>
        </main>
    );
};

export default LoginPage;
