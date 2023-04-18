import { Modal } from '~/ui/components/modal/Modal';
import { Form, useLoaderData, useNavigate, useRevalidator } from '@remix-run/react';
import { generateSecret, hashSecret } from '~/utils/encryption/secret.server';
import { DataFunctionArgs, json, redirect } from '@remix-run/node';
import { FormTextInput } from '~/ui/components/form/FormTextInput';
import { Button } from '~/ui/components/button/Button';
import { requireParam } from '~/utils/params/params.server';
import { requireDeveloper } from '~/utils/auth/session.server';
import { prisma } from '~/utils/prisma/prisma.server';
import { requireUserApplication } from '~/utils/prisma/models/application.server';
import * as url from 'url';
import { DateTime } from 'luxon';

export const loader = async () => {
    const secret = await generateSecret();
    return json({ secret });
};

export const action = async ({ request, params }: DataFunctionArgs) => {
    const applicationId = requireParam('applicationId', params);
    const user = await requireDeveloper(request);
    const application = await requireUserApplication(applicationId, user.id);
    const formData = await request.formData();
    const applicationSecretName = await formData.get('applicationSecretName')?.toString();
    if (!applicationSecretName) {
        return json({
            errors: {
                applicationSecretName: 'Please provide a name for the secret',
            },
        });
    }
    const applicationSecret = formData.get('applicationSecret')?.toString();
    if (!applicationSecret) {
        return json({
            errors: {
                applicationSecret: 'Please provide an application secret',
            },
        });
    }
    await prisma.secret.create({
        data: {
            name: applicationSecretName,
            secret: applicationSecret,
            applicationId,
            createdAt: DateTime.now().toSeconds(),
        },
    });
    //In order to redirect
    const redirectionUrl = request.url.substring(0, request.url.lastIndexOf('/'));
    return redirect(`${redirectionUrl}?new=true`);
};

const CreateApplicationSecretsPage = () => {
    const { secret } = useLoaderData<typeof loader>();

    const navigate = useNavigate();
    const { revalidate } = useRevalidator();
    return (
        <Modal toggleModal={() => navigate(-1)} showModal={true}>
            <Form method={'POST'}>
                <h3 className={'text-title-small font-medium'}>Create secret</h3>
                <FormTextInput
                    name={'applicationSecretName'}
                    required={true}
                    placeholder={'My fancy secret #1'}
                    labelText={'Secret name'}
                />
                <FormTextInput
                    name={'applicationSecret'}
                    required={true}
                    placeholder={'secret'}
                    labelText={'Application secret'}
                    defaultValue={secret}></FormTextInput>
                <span className={'flex justify-end gap-2'}>
                    <Button
                        onClick={() => revalidate()}
                        type={'button'}
                        color={'secondary'}
                        padding={'medium'}>
                        Regenerate
                    </Button>
                    <Button padding={'medium'}>Create</Button>
                </span>
            </Form>
        </Modal>
    );
};

export default CreateApplicationSecretsPage;
