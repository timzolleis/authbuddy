import { DangerIcon } from '~/ui/icons/DangerIcon';
import { Button } from '~/ui/components/button/Button';
import { Link } from '@remix-run/react';

export const ErrorComponent = ({
    headline,
    description,
    actionText,
    actionLink,
}: {
    headline: string;
    description: string;
    actionText?: string;
    actionLink?: string;
}) => {
    return (
        <main className={'mt-5 px-5 text-center'}>
            <section className={'rounded border border-white/30 p-5 lg:p-10'}>
                <h1 className={'text-sm font-medium'}>{headline}</h1>
                <p className={'text-sm text-neutral-400'}>{description}</p>
                {actionText && actionLink ? (
                    <div className={'mt-5 flex w-full justify-center'}>
                        <Link to={actionLink}>
                            <Button color={'secondary'}>{actionText}</Button>
                        </Link>
                    </div>
                ) : null}
            </section>
        </main>
    );
};
