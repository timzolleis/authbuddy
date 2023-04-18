import { DataFunctionArgs, json, redirect } from '@remix-run/node';
import * as crypto from 'crypto';
import { Form, Link, useLoaderData } from '@remix-run/react';
import { mapIncludes } from 'yaml/dist/compose/util-map-includes';
import { PageHeader } from '~/ui/components/page/PageHeader';
import { FormTextArea, FormTextInput } from '~/ui/components/form/FormTextInput';
import { Button } from '~/ui/components/button/Button';
import { prisma } from '~/utils/prisma/prisma.server';
import { requireDeveloper } from '~/utils/auth/session.server';
import Applications from '~/routes/applications';
import { Application } from '.prisma/client';
import applications from '~/routes/applications';

const errorMessage = (field: string) => `The field ${field} is required`;

export function validateApplicationFormData(formData: FormData) {
    const errors = new Map<string, string>();
    const applicationName = formData.get('applicationName')?.toString();
    if (!applicationName) {
        errors.set('applicationName', errorMessage('Application name'));
    }
    const applicationUrl = formData.get('applicationUrl')?.toString();
    if (!applicationUrl) {
        errors.set('applicationUrl', errorMessage('Application Url'));
    }
    const applicationDescription = formData.get('applicationDescription')?.toString();
    const applicationCallbackUrl = formData.get('applicationCallbackUrl')?.toString();
    if (!applicationCallbackUrl) {
        errors.set('applicationCallbackUrl', errorMessage('Application callback url'));
    }
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
    const user = await requireDeveloper(request);
    const formData = await request.formData();
    const validatedData = validateApplicationFormData(formData);
    if (validatedData.errors.size >= 1) {
        return json({ errors: validatedData.errors });
    }
    //We have to override the type system here since through assuring that we have no errors, we are sure that all values do exist.
    await prisma.application.create({
        data: {
            userId: user.id,
            name: validatedData.applicationName!,
            description: validatedData.applicationDescription,
            homepage: validatedData.applicationUrl!,
            redirectUrl: validatedData.applicationCallbackUrl!,
        },
    });
    return redirect('/applications');
};

const NewApplicationPage = () => {
    return (
        <section>
            <div className={'flex w-full flex-col items-center justify-center'}>
                <Form method={'POST'} className={'grid w-full gap-2 md:w-1/2'}>
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

export default NewApplicationPage;
