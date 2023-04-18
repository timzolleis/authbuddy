import { DataFunctionArgs, defer, json } from '@remix-run/node';
import { PageHeader } from '~/ui/components/page/PageHeader';
import { Button } from '~/ui/components/button/Button';
import { prisma } from '~/utils/prisma/prisma.server';
import { requireDeveloper } from '~/utils/auth/session.server';
import { Await, Link, Outlet, useLoaderData } from '@remix-run/react';
import { Suspense } from 'react';
import { Application } from '.prisma/client';
import { DangerIcon } from '~/ui/icons/DangerIcon';
import applications from '~/routes/applications';
import { Badge } from '~/ui/components/common/Badge';

export const loader = async ({ request, params }: DataFunctionArgs) => {
    const user = await requireDeveloper(request);
    const applications = prisma.application
        .findMany({
            where: {
                user: {
                    id: user.id,
                },
            },
        })
        .catch();
    return defer({ applications });
};
const ApplicationPage = () => {
    const { applications } = useLoaderData<typeof loader>();
    return (
        <main>
            <div className={'flex items-center justify-between'}>
                <PageHeader>My Applications</PageHeader>
                <Link to={'/applications/new'}>
                    <Button>New Application</Button>
                </Link>
            </div>
            <Suspense fallback={<p>Loading applications...</p>}>
                <Await resolve={applications}>
                    {(resolvedApplications) =>
                        resolvedApplications.length > 0 ? (
                            <Applications applications={resolvedApplications} />
                        ) : (
                            <NoApplicationsComponent />
                        )
                    }
                </Await>
            </Suspense>
        </main>
    );
};

const Applications = ({ applications }: { applications: Application[] }) => {
    return (
        <div className={'mt-5 grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-6'}>
            {applications.map((application) => (
                <ApplicationComponent
                    key={application.id}
                    application={application}></ApplicationComponent>
            ))}
        </div>
    );
};

const ApplicationComponent = ({ application }: { application: Application }) => {
    return (
        <Link
            to={`/applications/${application.id}/settings`}
            className={
                'flex items-center justify-between rounded-md border border-white/30 px-5 py-3 transition duration-200 ease-in-out hover:scale-105 hover:bg-black'
            }>
            <div>
                <p>{application.name}</p>
                <p className={'text-xs text-neutral-500'}>{application.homepage}</p>
            </div>
            <p
                className={`text-xs font-light leading-none ${
                    application.deactivated ? 'text-red-500' : 'text-green-500'
                }`}>
                {application.deactivated ? 'NOT ACTIVE' : 'ACTIVE'}
            </p>
        </Link>
    );
};

const NoApplicationsComponent = () => {
    return (
        <main className={'mt-5'}>
            <section className={'lg: w-1/2 rounded border border-white/30 p-5 lg:p-10'}>
                <span className={'flex items-center gap-2'}>
                    <DangerIcon size={'sm'} />
                    <h1 className={'text-headline-medium font-bold'}>No active applications</h1>
                </span>
                <p className={'text-sm text-neutral-300'}>
                    It looks like you dont have any active applications. To create one, click here:
                </p>
                <div className={'mt-3 flex w-full items-center gap-2'}>
                    <Link to={'/applications/new'}>
                        <Button>Create new Application</Button>
                    </Link>
                </div>
            </section>
        </main>
    );
};

export default ApplicationPage;
