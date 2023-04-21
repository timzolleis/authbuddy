import { For } from '@babel/types';
import { json } from '@remix-run/node';
import { FormFieldMissingException } from '~/exception/FormFieldMissingException';

export function requireFormDataField(formData: FormData, field: string, errorMessage?: string) {
    const value = formData.get(field)?.toString();
    if (!value) {
        throw new FormFieldMissingException(field);
    }
    return value;
}
