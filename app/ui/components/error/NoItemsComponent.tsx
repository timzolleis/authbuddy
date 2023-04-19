import { DangerIcon } from '~/ui/icons/DangerIcon';

export const NoItemsComponent = ({
    headline,
    description,
}: {
    headline: string;
    description: string;
}) => {
    return (
        <main className={'mt-5 text-center'}>
            <section className={'rounded border border-white/30 p-5 lg:p-10'}>
                <h1 className={'text-sm font-medium'}>{headline}</h1>
                <p className={'text-sm text-neutral-400'}>{description}</p>
            </section>
        </main>
    );
};
