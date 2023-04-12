import type { DataFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
//This component is responsible for retrieving the actual access tokens and information by the token
export const loader = async ({ request, params }: DataFunctionArgs) => {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    if (!code) {
        throw redirect('/login');
    }

    return null;
};
