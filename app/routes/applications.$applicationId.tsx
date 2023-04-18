import { Outlet } from '@remix-run/react';

const links = [
    {
        name: 'Settings',
        href: 'settings',
    },
    {
        name: 'Secrets',
        href: 'secrets',
    },
];

export const handle = {
    nav: {
        links,
    },
};

const ApplicationPage = () => {
    return <Outlet />;
};
export default ApplicationPage;
