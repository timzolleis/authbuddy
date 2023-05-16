import { DataFunctionArgs, json, redirect } from '@remix-run/node';
import * as crypto from 'crypto';
import { Form, Link } from '@remix-run/react';
import { PageHeader } from '~/components/ui/PageHeader';
import { Input } from '~/components/ui/Input';
import { Button } from '~/components/ui/Button';
import { prisma } from '~/utils/prisma/prisma.server';
import { requireDeveloper } from '~/utils/auth/session.server';
import { Application } from '.prisma/client';
import { ErrorComponent } from '~/components/features/error/ErrorComponent';
import { requireFormDataField } from '~/utils/form/formdata.server';
import { Textarea } from '~/components/ui/TextArea';

export function validateApplicationFormData(formData: FormData) {
    const errors = new Map<string, string>();
    const applicationName = requireFormDataField(formData, 'applicationName');
    const applicationUrl = requireFormDataField(formData, 'applicationUrl');
    const applicationDescription = formData.get('applicationDescription')?.toString();
    const applicationCallbackUrl = requireFormDataField(formData, 'applicationCallbackUrl');
    return {
        applicationName,
        applicationDescription,
        applicationUrl,
        applicationCallbackUrl,
        errors,
    };
}

export const loader = async ({ request, params }: DataFunctionArgs) => {
    const applicationSecret = crypto.randomBytes(32).toString('hex');
    return json({ applicationSecret });
};

export const action = async ({ request, params }: DataFunctionArgs) => {
    try {
        const user = await requireDeveloper(request);
        const formData = await request.formData();
        const validatedData = validateApplicationFormData(formData);
        await prisma.application.create({
            data: {
                userId: user.id,
                name: validatedData.applicationName,
                description: validatedData.applicationDescription,
                homepage: validatedData.applicationUrl,
                redirectUrl: validatedData.applicationCallbackUrl,
            },
        });
        return redirect('/applications');
    } catch (e) {
        if (e instanceof Error) {
            throw json({ error: e.message });
        }
        throw json({ error: 'Unknown error' });
    }
};

const NewApplicationPage = () => {
    return (
        <section>
            <div className={'flex w-full flex-col items-center justify-center'}>
                <Form method={'POST'} className={'grid w-full gap-2'}>
                    <PageHeader divider={true}>Create Application</PageHeader>
                    <ApplicationForm />
                    <div className={'flex items-center gap-2 border-t border-t-white/30 py-2'}>
                        <Button>Create application</Button>
                        <Link to={'/applications'}>
                            <Button variant={'secondary'}>Cancel</Button>
                        </Link>
                    </div>
                </Form>
            </div>
        </section>
    );
};

export const ApplicationForm = ({ application }: { application?: Application }) => {
    return (
        <div className={'flex w-full flex-col space-y-4'}>
            <Input
                defaultValue={application?.name}
                required={true}
                label={'Application name'}
                name={'applicationName'}
                placeholder={'My new Application'}
                description={'The name of your application'}
            />
            <Input
                defaultValue={application?.homepage}
                label={'Application Url'}
                required={true}
                name={'applicationUrl'}
                placeholder={'https://myfancyapplication.com'}
                description={'The homepage of your application'}
            />
            <Textarea
                defaultValue={application?.description ?? undefined}
                name={'applicationDescription'}
                label={'Application description'}
                required={false}
                placeholder={'This is an application for providing VALORANT statistics (optional)'}
                description={'This is displayed to all users of your application.'}
            />
            <Input
                defaultValue={application?.redirectUrl}
                name={'applicationCallbackUrl'}
                required={true}
                label={'Authorization callback Url'}
                placeholder={'https://myfancyapplication.com/callback'}
                description={'Your application’s callback url'}
            />
        </div>
    );
};

export const ErrorBoundary = () => {
    return (
        <ErrorComponent
            headline={'Error when creating your application'}
            description={'There was an error creating your application. Please try again later'}
            actionText={'Go back to applications'}
            actionLink={'/applications'}
        />
    );
};

export default NewApplicationPage;
