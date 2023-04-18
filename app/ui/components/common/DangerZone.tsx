import { ReactNode } from 'react';
import { Button } from '~/ui/components/button/Button';

export const DangerZone = ({ children }: { children: ReactNode }) => {
    return (
        <section>
            <h3 className={'text-title-large font-medium'}>Danger zone</h3>
            <div
                className={
                    'mt-2 grid divide-y divide-white/30 rounded-md border border-red-500/50 px-5 py-3'
                }>
                {children}
            </div>
        </section>
    );
};

export const DangerZoneAction = ({
    name,
    description,
    buttonName,
    onClick,
}: {
    name: string;
    description: string;
    buttonName: string;
    onClick: () => any;
}) => {
    return (
        <section className={'flex items-center justify-between py-3'}>
            <div className={'leading-tight'}>
                <p className={'font-medium'}>{name}</p>
                <p className={'text-sm text-neutral-400'}>{description}</p>
            </div>
            <Button onClick={() => onClick()} type={'button'} padding={'medium'} color={'danger'}>
                {buttonName}
            </Button>
        </section>
    );
};
