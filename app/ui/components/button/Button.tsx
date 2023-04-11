import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { ExternalLinkIcon } from '~/ui/icons/ExternalLinkIcon';

const button = cva('rounded p-3 font-semibold', {
    variants: {
        color: {
            primary: 'bg-red-500',
            secondary: 'bg-neutral-900 border border-white/30',
        },
        external: {
            true: '',
            false: '',
        },
        width: {
            normal: '',
            full: 'w-full',
        },
    },
    defaultVariants: {
        color: 'primary',
        external: false,
    },
});

interface ButtonProps extends VariantProps<typeof button> {
    children: ReactNode | string;
}

export const Button = ({ color, children, external, width }: ButtonProps) => {
    return (
        <button className={button({ color, width })}>
            {external ? (
                <span className={'flex items-center gap-2'}>
                    {children}
                    <ExternalLinkIcon />
                </span>
            ) : (
                children
            )}
        </button>
    );
};
