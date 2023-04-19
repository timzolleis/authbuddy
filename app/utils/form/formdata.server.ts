import { For } from '@babel/types';
import { json } from '@remix-run/node';

export function requireFormDataField(formData: FormData, field: string, errorMessage: string) {
    const value = formData.get(field)?.toString();
    if (!value) {
        throw json({
            errors: {
                field: errorMessage,
            },
        });
    }
    return value;
}
