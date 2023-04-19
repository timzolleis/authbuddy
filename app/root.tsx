import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
} from '@remix-run/react';

import styles from './styles/app.css';
import { DataFunctionArgs, json, LinksFunction } from '@remix-run/node';
import { AppLayout } from '~/ui/layout/AppLayout';
import { commitLoginSession, getLoginSession, getUser } from '~/utils/auth/session.server';
import { toast, Toaster } from 'sonner';
import { getFlashMessage } from '~/utils/flash/flashmessages.server';
import { toastMessage } from '~/utils/hooks/toast';
import { useEffect } from 'react';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

export const loader = async ({ request }: DataFunctionArgs) => {
    const user = await getUser(request);
    const { message, header } = await getFlashMessage(request);

    return json({ user, message }, { headers: { 'Set-Cookie': header } });
};

export default function App() {
    const { user, message } = useLoaderData<typeof loader>();
    useEffect(() => {
        if (message) {
            console.log('Toasting');
            toastMessage(message);
        }
    }, [message]);
    return (
        <html lang='en'>
            <head>
                <meta charSet='utf-8' />
                <meta name='viewport' content='width=device-width,initial-scale=1' />
                <Meta />
                <Links />
            </head>
            <body className={'bg-neutral-900'}>
                <AppLayout>
                    <Toaster position={'top-right'} theme={'dark'} />
                    <Outlet />
                    <ScrollRestoration />
                    <Scripts />
                    <LiveReload />
                </AppLayout>
            </body>
        </html>
    );
}
