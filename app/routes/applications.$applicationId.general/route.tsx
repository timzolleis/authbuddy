import { DataFunctionArgs, json, redirect } from '@remix-run/node';
import { requireDeveloperUser } from '~/utils/auth/session.server';
import { prisma } from '~/utils/prisma/prisma.server';
import { Form, Link, useLoaderData } from '@remix-run/react';
import { PageHeader } from '~/ui/components/page/PageHeader';
import { Button } from '~/ui/components/button/Button';
import { ApplicationFormComponent } from '~/routes/applications.new/route';
import { PageNavComponent } from '~/ui/components/nav/PageNavComponent';

export const loader = async ({ request, params }: DataFunctionArgs) => {
    const user = await requireDeveloperUser(request);
    const applicationId = params.applicationId;
    if (!applicationId) {
        throw redirect('/applications');
    }
    const application = await prisma.application.findUnique({
        where: {
            id_userId: {
                id: applicationId,
                userId: user.id,
            },
        },
    });

    if (!application) {
        throw new Error('Application not found');
    }
    return json({ application });
};

export const action = async ({ request, params }: DataFunctionArgs) => {
    return null;
};

const ApplicationPage = () => {
    const { application } = useLoaderData<typeof loader>();
    return (
        <section className={'flex'}>
            <div className={'flex w-full items-start justify-center gap-5'}>
                <Form method={'POST'} className={'grid w-full gap-2 md:w-1/2'}>
                    <span>
                        <p className={'text-sm text-neutral-500'}> Application</p>
                        <PageHeader>{application.name}</PageHeader>
                    </span>
                    <ApplicationFormComponent application={application} />
                    <div className={'flex items-center gap-2 border-t border-t-white/30 py-2'}>
                        <Button width={'normal'}>Create application</Button>
                        <Link to={'/applications'}>
                            <Button color={'secondary'}>Cancel</Button>
                        </Link>
                    </div>
                </Form>
            </div>
        </section>
    );
};

export default ApplicationPage;
