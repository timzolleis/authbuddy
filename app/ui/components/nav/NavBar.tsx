import { NavLink } from '@remix-run/react';

export const PageLinks = [
    {
        to: '/login',
        displayName: 'Login',
    },
];

export const NavBar = () => {
    return (
        <nav className={'flex items-center justify-between bg-black p-4'}>
            <div>
                <p>AuthBuddy</p>
            </div>
            <div className={'flex items-center gap-2 px-5'}>
                {PageLinks.map((link) => (
                    <Link key={link.to} to={link.to} displayName={link.displayName} />
                ))}
            </div>
        </nav>
    );
};

const Link = ({ to, displayName }: { to: string; displayName: string }) => {
    return <NavLink to={to}>{displayName}</NavLink>;
};
