import { NavLink, useMatches } from '@remix-run/react';

function filterLink(link: string) {
    if (link === '/') return '';
    return link;
}

export const SideNavComponent = () => {
    const matches = useMatches();
    const filteredMatches = matches.filter((match) => match.handle && match.handle.nav);
    return (
        <nav className={'min-w-max'}>
            {filteredMatches.map((match) => (
                <div
                    key={match.id}
                    className={'flex items-center gap-2 divide-y divide-white/30 md:grid'}>
                    {match.handle?.nav.links.map((link: { href: string; name: string }) => (
                        <NavLink
                            className={'min-w-max'}
                            key={link.href}
                            to={
                                link.href.startsWith('/')
                                    ? link.href
                                    : link.href.length >= 1
                                    ? `${match.pathname}/${link.href}`
                                    : `${match.pathname}`
                            }
                            prefetch={'intent'}>
                            {({ isActive }) => (
                                <div
                                    className={`rounded-md px-5 py-2 transition-all duration-75 hover:bg-neutral-800 ${
                                        isActive
                                            ? 'bg-neutral-800 font-medium '
                                            : 'text-neutral-400'
                                    }`}>
                                    {link.name}
                                </div>
                            )}
                        </NavLink>
                    ))}
                </div>
            ))}
        </nav>
    );
};
