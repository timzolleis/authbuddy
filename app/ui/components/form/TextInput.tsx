import { EyeIcon } from '~/ui/icons/EyeIcon';
import { ClosedEyeIcon } from '~/ui/icons/ClosedEyeIcon';
import { useState } from 'react';

interface TextInputProps {
    name?: string;
    required?: boolean;
    type?: 'text' | 'password';
    className?: string;
    placeholder?: string;
    id?: string;
}

export const TextInput = ({ name, type, placeholder, className, required, id }: TextInputProps) => {
    return (
        <input
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            className={`w-full rounded-md px-3 py-3 focus:outline-none md:py-2 ${className}`}
            required={required}
        />
    );
};

export const PasswordInput = ({ name, type, placeholder, className, required }: TextInputProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const togglePassword = () => {
        setShowPassword(!showPassword);
        const el = document.getElementById('password-input');
        if (el) {
            el.focus();
        }
    };

    return (
        <span
            className={`flex w-full items-center rounded-md pr-4 focus:outline-none ${className}`}>
            <TextInput
                id={'password-input'}
                type={showPassword ? 'text' : 'password'}
                required={required}
                name={name}
                className={'border-none bg-transparent hover:border-none hover:bg-transparent'}
                placeholder={placeholder}
            />
            {showPassword ? (
                <ClosedEyeIcon onClick={() => togglePassword()} />
            ) : (
                <EyeIcon onClick={() => togglePassword()} />
            )}
        </span>
    );
};
