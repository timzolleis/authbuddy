import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { ExternalLinkIcon } from '~/ui/icons/ExternalLinkIcon';

const button = cva('rounded', {
    variants: {
        color: {
            primary: 'bg-red-500',
            secondary: 'bg-neutral-900 border border-white/30',
        },
        external: {
            true: '',
            false: '',
        },
        font: {
            normal: 'font-normal',
            medium: 'font-medium',
            semibold: 'font-semibold',
        },
        width: {
            normal: '',
            full: 'w-full',
        },
        padding: {
            small: 'px-3 py-1',
            medium: 'px-3 py-2',
            large: 'px-3 py-3',
        },
    },
    defaultVariants: {
        color: 'primary',
        font: 'semibold',
        external: false,
        padding: 'large',
    },
});

interface ButtonProps extends VariantProps<typeof button> {
    children: ReactNode | string;
}

export const Button = ({ color, children, external, width, padding, font }: ButtonProps) => {
    return (
        <button className={button({ color, width, padding, font })}>
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
