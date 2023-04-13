import {Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData} from '@remix-run/react';

import styles from './styles/app.css';
import {DataFunctionArgs, json, LinksFunction} from '@remix-run/node';
import {AppLayout} from '~/ui/layout/AppLayout';
import {getInternalUser} from "~/utils/internal-auth/session.server";

export const links: LinksFunction = () => [{rel: 'stylesheet', href: styles}];

export const loader = async ({request}: DataFunctionArgs) => {
    const user = await getInternalUser(request)
    return json({user});
}


export default function App() {
    const {user} = useLoaderData<typeof loader>()
    return (
        <html lang='en'>
        <head>
            <meta charSet='utf-8'/>
            <meta name='viewport' content='width=device-width,initial-scale=1'/>
            <Meta/>
            <Links/>
        </head>
        <body>
        <AppLayout>
            <Outlet/>
            <ScrollRestoration/>
            <Scripts/>
            <LiveReload/>
        </AppLayout>
        </body>
        </html>
    );
}
