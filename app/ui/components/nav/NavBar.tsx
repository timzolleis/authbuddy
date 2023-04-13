import { Link, NavLink } from '@remix-run/react';
import { useOptionalUser } from '~/utils/hooks/user';
import { use } from 'ast-types';
import { UserComponent } from '~/ui/components/user/UserComponent';

export const PageLinks = [
    {
        to: '/login',
        displayName: 'Login',
    },
];

export const NavBar = () => {
    const user = useOptionalUser();
    return (
        <nav className={'flex items-center justify-between bg-neutral-800 p-4'}>
            <Link to={'/'}>
                <nav className={'flex items-center gap-2'}>
                    <img className={'h-6'} src='/resources/authbuddy_logo.png' alt='' />
                    <span className={'rounded bg-red-500 px-3 py-1'}>
                        <p className={'font-medium'}>AuthBuddy</p>
                    </span>
                </nav>
            </Link>
            <div className={'flex items-center gap-2 px-5'}>
                {user ? <UserComponent user={user} /> : null}
                <NavigationLink
                    to={user ? '/logout' : '/login'}
                    displayName={user ? 'Logout' : 'Login'}></NavigationLink>
            </div>
        </nav>
    );
};

const NavigationLink = ({ to, displayName }: { to: string; displayName: string }) => {
    return (
        <NavLink className={'rounded-md border border-white/30 px-5 py-2'} to={to}>
            {displayName}
        </NavLink>
    );
};
