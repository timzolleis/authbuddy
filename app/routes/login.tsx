import { Outlet } from '@remix-run/react';

const LoginPage = () => {
    return (
        <main className={'flex h-full items-center justify-center'}>
            <Outlet />
        </main>
    );
};

export default LoginPage;
