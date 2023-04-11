import { Link, NavLink } from '@remix-run/react';

export const PageLinks = [
    {
        to: '/login',
        displayName: 'Login',
    },
];

export const NavBar = () => {
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
                {PageLinks.map((link) => (
                    <NavigationLink key={link.to} to={link.to} displayName={link.displayName} />
                ))}
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
