import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';

export const icon = cva('', {
    variants: {
        size: {
            xs: 'h-4',
            sm: 'h-10',
            normal: 'h-14',
            xl: 'h-20',
        },
        color: {
            primary: 'stroke-red-500',
            secondary: 'stroke-white-500',
        },
    },
    defaultVariants: {
        size: 'xs',
        color: 'secondary',
    },
});

export interface IconProps extends VariantProps<typeof icon> {}
