import { TextInput } from '@tremor/react';
import { pl } from 'date-fns/locale';
import { cva, VariantProps } from 'class-variance-authority';
import { b } from 'vite-node/types-63205a44';
import is from '@sindresorhus/is';
import undefined = is.undefined;

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
}

export const FormTextInput = ({
    name,
    placeholder,
    defaultValue,
    labelText,
    required = false,
    border,
    descriptionText,
}: InputProps) => {
    return (
        <span className={'space-y-1'}>
            <label className={'text-sm'} htmlFor={name}>
                {labelText} {required ? <span className={'text-red-500'}>*</span> : null}
            </label>
            <span className={'flex items-center pb-1'}>
                <TextInput
                    defaultValue={defaultValue}
                    required={required}
                    name={name}
                    placeholder={placeholder}
                    className={formTextInput({ border })}
                />
            </span>
            <p className={'mt-2 text-xs text-gray-400'}>{descriptionText}</p>
        </span>
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
}: InputProps) => {
    return (
        <span className={'space-y-1'}>
            <label className={'text-sm'} htmlFor={name}>
                {labelText} {required ? <span className={'text-red-500'}>*</span> : null}
            </label>
            <span className={'flex items-center pb-1'}>
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
            </span>
            <p className={'mt-2 text-xs text-gray-400'}>{descriptionText}</p>
        </span>
    );
};
