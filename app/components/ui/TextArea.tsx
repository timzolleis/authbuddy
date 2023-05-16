import * as React from 'react';
import { cn } from '~/utils/css';
import { Label } from '~/components/ui/Label';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    description?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <div className={''}>
                <div className={'flex items-center gap-1'}>
                    <Label>{props.label}</Label>
                    {props.required && <p className={'text-sm text-red-500'}>*</p>}
                </div>
                <textarea
                    className={cn(
                        'my-2 flex h-20 w-full rounded-md border border-input bg-neutral-900 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                <p className='text-sm text-muted-foreground'>{props.description}</p>
                <p className='text-sm text-red-500'>{props.error}</p>
            </div>
        );
    }
);
Textarea.displayName = 'Textarea';

export { Textarea };
