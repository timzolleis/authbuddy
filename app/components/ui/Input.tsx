import React from 'react';
import { cn } from '~/utils/css';
import { Label } from '~/components/ui/Label';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    description?: string;
    error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <div className={'w-full space-y-1'}>
                <div className={'flex items-center gap-1'}>
                    <Label>{props.label}</Label>
                    {props.required && props.label && <p className={'text-sm text-red-500'}>*</p>}
                </div>
                <input
                    type={type}
                    className={cn(
                        'flex h-10 w-full rounded-md border border-input bg-neutral-900 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                <p className='text-sm text-muted-foreground '>{props.description}</p>
                <p className='text-sm text-red-500 '>{props.error}</p>
            </div>
        );
    }
);
Input.displayName = 'Input';

export { Input };
