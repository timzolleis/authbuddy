import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { ExternalLinkIcon } from '~/ui/icons/ExternalLinkIcon';

const button = cva('rounded', {
    variants: {
        color: {
            primary: 'bg-red-500 disabled:opacity-50 disabled:bg-red-800',
            secondary: 'bg-neutral-900 border border-white/30',
            danger: 'text-red-500 font-medium bg-neutral-800 border border-red-500/50',
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
    disabled?: boolean;
    type?: 'submit' | 'button';
    onClick?: () => any;
    value?: string;
}

export const Button = ({
    color,
    children,
    disabled = false,
    external,
    width,
    padding,
    font,
    type = 'submit',
    onClick,
    value,
}: ButtonProps) => {
    return (
        <button
            name={'intent'}
            value={value}
            disabled={disabled}
            type={type}
            className={button({ color, width, padding, font })}
            onClick={() => (onClick ? onClick() : void 0)}>
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
