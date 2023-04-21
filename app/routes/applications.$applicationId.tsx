import { isRouteErrorResponse, Outlet, useRouteError } from '@remix-run/react';
import { EntityNotFoundException } from '~/exception/EntityNotFoundException';
import { errorTranslations } from '~/content/error-translations';
import { ErrorComponent } from '~/ui/components/error/ErrorComponent';

const links = [
    {
        name: 'Settings',
        href: 'settings',
    },
    {
        name: 'Secrets',
        href: 'secrets',
    },
];

export const handle = {
    nav: {
        links,
    },
};

const ApplicationPage = () => {
    return <Outlet />;
};
export const ErrorBoundary = () => {
    const error = useRouteError();
    if (isRouteErrorResponse(error))
        return (
            <ErrorComponent
                headline={'The application does not exist'}
                description={'The application youre looking for does not exist.'}
            />
        );
    else if (error instanceof Error) {
        if (error.message.includes('missing')) {
            return (
                <ErrorComponent
                    headline={'The application does not exist'}
                    description={'The application youre looking for does not exist.'}
                />
            );
        }
    }
};

export default ApplicationPage;
