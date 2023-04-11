import { NavLink, Outlet } from '@remix-run/react';
import { Tab, TabList } from '@tremor/react';

const LoginPage = () => {
    return (
        <main className={'flex items-center justify-center'}>
            <section
                className={
                    'flex flex-col items-center justify-center rounded-md border border-white/10 md:mt-10 md:w-1/2 md:p-10'
                }>
                <div
                    className={
                        'flex w-full items-center justify-between border-b border-neutral-600 text-center'
                    }>
                    <NavLink
                        className={({ isActive }) =>
                            isActive
                                ? `w-full border-b-2 border-neutral-400 px-3`
                                : `w-full border-none px-3`
                        }
                        to={'/login/user'}>
                        User
                    </NavLink>
                    <NavLink
                        className={({ isActive }) =>
                            isActive
                                ? `w-full border-b-2 border-neutral-400 px-3`
                                : `w-full border-none px-3`
                        }
                        to={'/login/developer'}>
                        Developer
                    </NavLink>
                </div>
                <Outlet />
            </section>
        </main>
    );
};

export default LoginPage;
