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
                <div className={'flex items-center gap-1'}>
                    <Label>{props.label}</Label>
                    {props.required && <p className={'text-sm text-red-500'}>*</p>}
                </div>
                <div className={'flex items-center gap-2'}>
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        ref={passwordInputRef}
                        {...props}
                        label={undefined}
                    />
                    <Button type={'button'} variant={'secondary'} onClick={togglePassword}>
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                </div>
            </div>
        );
    }
);
