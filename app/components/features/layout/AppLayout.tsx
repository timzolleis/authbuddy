import type { ReactNode } from 'react';
import { NavBar } from '~/components/ui/NavBar';
import { SideNavigation } from '~/components/features/navigation/SideNavigation';

export const AppLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className={'flex min-h-screen flex-col font-sans text-white'}>
            <NavBar></NavBar>
            <div className={'container mt-5 flex grow flex-col gap-5 py-2 md:flex-row md:px-20'}>
                <SideNavigation />
                <section className={'flex w-full grow justify-center'}>
                    <main className={'w-full lg:w-4/5 xl:w-2/3'}>{children}</main>
                </section>
            </div>
        </div>
    );
};
