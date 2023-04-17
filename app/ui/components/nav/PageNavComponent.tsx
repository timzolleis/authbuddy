import { Link } from '@remix-run/react';

type Link = {
    name: string;
    to: string;
};

export const PageNavComponent = ({ links }: { links: Link[] }) => {
    return (
        <nav
            className={
                'grid gap-1 divide-y divide-neutral-500 rounded-md border border-white/30 bg-neutral-900 leading-tight'
            }>
            {links.map((link) => (
                <Link to={link.to} className={'px-5 py-2 pr-20 text-sm font-medium'}>
                    {link.name}
                </Link>
            ))}
        </nav>
    );
};
