import { DataFunctionArgs, json } from '@remix-run/node';
import { decryptString, encryptString } from '~/utils/encryption/encryption';

export const loader = async ({ request, params }: DataFunctionArgs) => {
    const testString = 'this is my fancy... string';
    const encrypted = encryptString(testString);
    const decrypted = decryptString(encrypted);
    return json({ encrypted, decrypted });
};
