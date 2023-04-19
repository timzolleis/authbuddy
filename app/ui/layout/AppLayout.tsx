import type { ReactNode } from 'react';
import { NavBar } from '~/ui/components/nav/NavBar';
import { SideNavComponent } from '~/ui/components/nav/SideNavComponent';

export const AppLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className={'h-screen font-inter text-white'}>
            <NavBar></NavBar>
            <div
                className={
                    'mt-5 border-b border-b-white/30 py-1 md:absolute md:border-none md:py-2 md:pl-20'
                }>
                <SideNavComponent />
            </div>
            <section className={'flex justify-center px-5 py-2 md:px-20'}>
                <main className={'w-full lg:w-4/5 xl:w-2/3'}>{children}</main>
            </section>
        </div>
    );
};
