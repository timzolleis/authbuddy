import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
} from '@remix-run/react';
import stylesheet from '~/tailwind.css';
import { DataFunctionArgs, json, LinksFunction } from '@remix-run/node';
import { AppLayout } from '~/components/features/layout/AppLayout';
import { getPlayer, getUser } from '~/utils/auth/session.server';
import { Toaster } from 'sonner';
import { getFlashMessage } from '~/utils/flash/flashmessages.server';
import { toastMessage } from '~/utils/flash/toast';
import { useEffect } from 'react';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: stylesheet }];

export const loader = async ({ request }: DataFunctionArgs) => {
    const user = await getUser(request);
    const player = await getPlayer(request);
    const { message, header } = await getFlashMessage(request);

    return json({ user, player, message }, { headers: { 'Set-Cookie': header } });
};

export default function App() {
    const { user, message } = useLoaderData<typeof loader>();
    useEffect(() => {
        if (message) {
            toastMessage(message);
        }
    }, [message]);
    return (
        <html lang='en'>
            <head>
                <meta charSet='utf-8' />
                <meta
                    name='viewport'
                    content='width=device-width,initial-scale=1, maximum-scale=1'
                />
                <Meta />
                <Links />
            </head>
            <body className={'bg-background'}>
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
