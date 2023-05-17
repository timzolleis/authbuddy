import { destroyUserSession } from '~/utils/auth/session.server';
import { DataFunctionArgs, redirect } from '@remix-run/node';

export const loader = async ({ request }: DataFunctionArgs) => {
    //Destroy dev session
    const setDevSessionCookieString = await destroyUserSession(request);
    //TODO: Enable normal user logout

    return redirect('/', {
        headers: {
            'Set-Cookie': setDevSessionCookieString,
        },
    });
};
