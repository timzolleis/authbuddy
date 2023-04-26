import { Outlet } from '@remix-run/react';

const LoginPage = () => {
    return (
        <main className={'mt-10 flex flex-col items-center justify-center'}>
            <div
                className={
                    'md:.bg-neutral-800 mt-5 w-full rounded-lg border-white/30 p-2 md:border md:p-10 lg:w-1/2'
                }>
                <Outlet />
            </div>
        </main>
    );
};

export default LoginPage;
