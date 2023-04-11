import type { ReactNode } from 'react';
import { NavBar } from '~/ui/components/nav/NavBar';

export const AppLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className={'h-screen bg-neutral-900 font-inter text-white'}>
            <NavBar></NavBar>
            <main className={'px-5 py-2'}>{children}</main>
        </div>
    );
};
