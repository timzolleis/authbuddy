import type { DataFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { getProviderFromParam } from '~/routes/internal.auth.$provider/route';
import { setInternalUser } from '~/utils/internal-auth/session.server';
//This component is responsible for retrieving the actual access tokens and information by the token
export const loader = async ({ request, params }: DataFunctionArgs) => {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    if (!code) {
        throw redirect('/login');
    }
    const authenticator = getProviderFromParam(params);
    const token = await authenticator.getAccessToken(code);
    console.log(token);
    if (!token) {
        console.log('Token missing');
        throw redirect('/login');
    }
    const user = await authenticator.getUserInformation(token);
    if (user) {
        const setSessionHeader = await setInternalUser(request, user);
        return redirect('/', {
            headers: {
                'Set-Cookie': setSessionHeader,
            },
        });
    }
    return redirect('/login');
};
