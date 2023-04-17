import { ReactNode } from 'react';
import { cva, VariantProps } from 'class-variance-authority';

const pageHeader = cva('text-headline-medium font-semibold', {
    variants: {
        center: {
            true: 'flex w-full justify-center',
        },
        divider: {
            true: 'border-b border-b-white/30 py-2',
        },
    },
});

interface PageHeaderProps extends VariantProps<typeof pageHeader> {
    children: ReactNode | string;
}

export const PageHeader = ({ children, center, divider }: PageHeaderProps) => {
    return (
        <span className={pageHeader({ center, divider })}>
            <h1>{children}</h1>
        </span>
    );
};
