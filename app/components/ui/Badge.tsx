import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import React from 'react';
import { cn } from '~/utils/css';

// const badgeVariants = cva(
//     'inline-flex items-center border rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
//     {
//         variants: {
//             color: {
//                 green: 'bg-green-800/50 text-green-500 border-green-500',
//                 red: 'bg-red-800/50 text-red-500 border-red-500',
//                 amber: 'bg-amber-800/50 text-amber-500 border-amber-500',
//                 violet: 'bg-violet-800/50 text-violet-500 border-violet-500',
//                 fuchsia: 'bg-fuchsia-800/50 text-fuchsia-500 border-fuchsia-500',
//                 sky: 'bg-sky-800/50 text-sky-500 border-sky-500',
//             },
//         },
//         defaultVariants: {
//             color: 'green',
//         },
//     }
// );

const badgeVariants = cva(
    'inline-flex items-center border rounded-full px-2.5 py-1 text-xs font-semibold transition-colors leading-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    {
        variants: {
            variant: {
                green: 'bg-green-800/50 text-green-500 border-green-500',
                red: 'bg-red-800/50 text-red-500 border-red-500',
                amber: 'bg-amber-800/50 text-amber-500 border-amber-500',
                violet: 'bg-violet-800/50 text-violet-500 border-violet-500',
                fuchsia: 'bg-fuchsia-800/50 text-fuchsia-500 border-fuchsia-500',
                sky: 'bg-sky-800/50 text-sky-500 border-sky-500',
            },
        },
        defaultVariants: {
            variant: 'green',
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
