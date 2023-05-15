import { Link, NavLink } from '@remix-run/react';
import { useOptionalUser } from '~/utils/hooks/user';
import { UserAvatar } from '~/components/features/user/UserAvatar';
import { Button } from '~/components/ui/Button';

export const PageLinks = [
    {
        to: '/login',
        displayName: 'Login',
    },
];

export const NavBar = () => {
    const user = useOptionalUser();
    return (
        <nav
            className={
                'flex items-center justify-between bg-background-secondary px-5 py-4 md:px-20'
            }>
            <Link to={'/'}>
                <nav className={'flex items-center gap-2'}>
                    <img className={'h-6'} src='/resources/authbuddy_logo.png' alt='' />
                    <span className={'rounded bg-red-500 px-3 py-1'}>
                        <p className={'font-medium'}>AuthBuddy</p>
                    </span>
                </nav>
            </Link>
            <div className={'flex items-center gap-2 pl-5'}>
                {user?.role === 'DEVELOPER' ? (
                    <nav className={'mr-3'}>
                        <NavigationLink
                            to={'/applications'}
                            displayName={'Applications'}></NavigationLink>
                    </nav>
                ) : null}
                {user ? <UserAvatar user={user} /> : null}
                <Link to={user ? '/logout' : '/login'}>
                    <Button variant={'secondary'}>{user ? 'Logout' : 'Login'}</Button>
                </Link>
            </div>
        </nav>
    );
};

const NavigationLink = ({ to, displayName }: { to: string; displayName: string }) => {
    return (
        <NavLink className={'font-medium'} to={to}>
            {displayName}
        </NavLink>
    );
};
