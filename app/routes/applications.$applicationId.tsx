import { Outlet } from '@remix-run/react';

const links = [
    {
        name: 'General',
        href: 'general',
    },
    {
        name: 'Configuration',
        href: 'config',
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
