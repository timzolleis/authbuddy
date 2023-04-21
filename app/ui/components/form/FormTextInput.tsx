import { TextInput } from '@tremor/react';
import { pl } from 'date-fns/locale';
import { cva, VariantProps } from 'class-variance-authority';
import { b } from 'vite-node/types-63205a44';
import is from '@sindresorhus/is';
import undefined = is.undefined;
import { ReactNode } from 'react';
import { lab } from 'd3-color';

const formTextInput = cva(
    'bg-neutral-900 w-full hover:bg-neutral-800 rounded-md placeholder:text-gray-500 text-white placeholder:font-medium',
    {
        variants: {
            border: {
                true: 'border border-white/30',
            },
            height: {
                50: 'min-h-[50px] h-[50px]',
            },
            textarea: {
                true: 'appearance-none',
            },
        },
        defaultVariants: {
            border: true,
        },
    }
);

interface InputProps extends VariantProps<typeof formTextInput> {
    name: string;
    defaultValue?: string;
    required: boolean;
    placeholder: string;
    labelText?: string;
    descriptionText?: string;
    errorText?: string;
}

interface FormInputProps extends InputProps {
    children: ReactNode;
}

export const FormTextInput = ({
    name,
    placeholder,
    defaultValue,
    labelText,
    required = false,
    border,
    descriptionText,
    errorText,
}: InputProps) => {
    return (
        <FormInput
            name={name}
            required={required}
            placeholder={placeholder}
            descriptionText={descriptionText}
            labelText={labelText}
            errorText={errorText}
            defaultValue={defaultValue}>
            <TextInput
                defaultValue={defaultValue}
                required={required}
                name={name}
                placeholder={placeholder}
                className={formTextInput({ border })}
            />
        </FormInput>
    );
};

export const FormTextArea = ({
    name,
    textarea,
    defaultValue,
    height,
    placeholder,
    labelText,
    required = false,
    border,
    descriptionText,
    errorText,
}: InputProps) => {
    return (
        <FormInput
            name={name}
            required={required}
            placeholder={placeholder}
            labelText={labelText}
            descriptionText={descriptionText}
            errorText={errorText}>
            <textarea
                defaultValue={defaultValue}
                name={name}
                required={required}
                placeholder={placeholder}
                className={`${formTextInput({
                    border,
                    textarea,
                    height,
                })} px-3 py-2 text-sm`}
            />
        </FormInput>
    );
};

const FormInput = ({
    name,
    labelText,
    required = false,
    descriptionText,
    errorText,
    children,
}: FormInputProps) => {
    return (
        <span className={'space-y-1'}>
            <label className={'text-sm'} htmlFor={name}>
                {labelText} {required ? <span className={'text-red-500'}>*</span> : null}
            </label>
            <span className={'flex items-center pb-1'}>{children}</span>
            <p className={'mt-2 text-xs text-gray-400'}>{descriptionText}</p>
            <p className={'text-xs text-red-500 '}>{errorText}</p>
        </span>
    );
};
