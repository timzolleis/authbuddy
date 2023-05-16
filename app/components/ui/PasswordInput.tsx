import React, { useRef, useState } from 'react';
import { Input, InputProps } from '~/components/ui/Input';
import { Label } from '~/components/ui/Label';
import { cn } from '~/utils/css';
import { Button } from '~/components/ui/Button';
import { Eye, EyeOff } from 'lucide-react';

export const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);
        const passwordInputRef = useRef<HTMLInputElement>(null);
        const togglePassword = () => {
            setShowPassword(!showPassword);
            if (passwordInputRef.current) {
                passwordInputRef.current.focus();
            }
        };
        return (
            <div className={'w-full space-y-1'}>
                <Label>{props.label}</Label>
                <div className={'flex items-center gap-2'}>
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        className={cn(
                            'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                            className
                        )}
                        ref={passwordInputRef}
                        {...props}
                    />
                    <Button type={'button'} variant={'secondary'} onClick={togglePassword}>
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                </div>
            </div>
        );
    }
);
