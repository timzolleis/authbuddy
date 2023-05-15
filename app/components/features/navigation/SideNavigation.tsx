import { NavLink, useMatches } from '@remix-run/react';
import { buttonVariants } from '~/components/ui/Button';

export const SideNavigation = () => {
    const matches = useMatches();
    const filteredMatches = matches.filter((match) => match.handle && match.handle.nav);
    return (
        <nav className={'min-w-max'}>
            {filteredMatches.map((match, index) => (
                <div
                    key={match.id}
                    className={
                        'flex items-center justify-items-center gap-2 divide-white/30 md:grid md:divide-y'
                    }>
                    {match.handle?.nav.links.map(
                        (link: { href: string; name: string }, index: number) => (
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
                                    <div className={index !== 0 ? 'md:mt-2' : ''}>
                                        <div
                                            className={buttonVariants({
                                                variant: isActive ? 'secondary' : 'ghost',
                                            })}>
                                            {link.name}
                                        </div>
                                    </div>
                                )}
                            </NavLink>
                        )
                    )}
                </div>
            ))}
        </nav>
    );
};
