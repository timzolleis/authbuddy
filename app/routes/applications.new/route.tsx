import { DataFunctionArgs, json, redirect } from '@remix-run/node';
import * as crypto from 'crypto';
import { Form, Link, useActionData, useLoaderData } from '@remix-run/react';
import { mapIncludes } from 'yaml/dist/compose/util-map-includes';
import { PageHeader } from '~/ui/components/page/PageHeader';
import { FormTextArea, FormTextInput } from '~/ui/components/form/FormTextInput';
import { Button } from '~/ui/components/button/Button';
import { prisma } from '~/utils/prisma/prisma.server';
import { requireDeveloper } from '~/utils/auth/session.server';
import Applications from '~/routes/applications';
import { Application } from '.prisma/client';
import applications from '~/routes/applications';
import { ErrorComponent } from '~/ui/components/error/ErrorComponent';
import { requireFormDataField } from '~/utils/form/formdata.server';

const errorMessage = (field: string) => `The field ${field} is required`;

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
                <Form method={'POST'} className={'grid w-full gap-2 '}>
                    <PageHeader divider={true}>New Application</PageHeader>
                    <ApplicationFormComponent />
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

export const ApplicationFormComponent = ({ application }: { application?: Application }) => {
    return (
        <div className={'flex w-full flex-col gap-4'}>
            <FormTextInput
                defaultValue={application?.name}
                required={true}
                labelText={'Application name'}
                name={'applicationName'}
                placeholder={'My new Application'}
                descriptionText={'The name of your application'}
            />
            <FormTextInput
                defaultValue={application?.homepage}
                labelText={'Application Url'}
                required={true}
                name={'applicationUrl'}
                placeholder={'https://myfancyapplication.com'}
                descriptionText={'The homepage of your application'}
            />
            <FormTextArea
                defaultValue={
                    application?.description !== null ? application?.description : undefined
                }
                textarea={true}
                height={50}
                name={'applicationDescription'}
                labelText={'Application description'}
                required={false}
                placeholder={'This is an application for providing VALORANT statistics (optional)'}
                descriptionText={'This is displayed to all users of your application.'}
            />
            <FormTextInput
                defaultValue={application?.redirectUrl}
                name={'applicationCallbackUrl'}
                required={true}
                labelText={'Authorization callback Url'}
                placeholder={'https://myfancyapplication.com/callback'}
                descriptionText={'Your application’s callback url'}
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
