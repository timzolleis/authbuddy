import { Modal } from '~/ui/components/modal/Modal';
import { Form, useLoaderData, useNavigate, useRevalidator } from '@remix-run/react';
import { generateSecret } from '~/utils/encryption/secret.server';
import { DataFunctionArgs, json, redirect } from '@remix-run/node';
import { FormTextInput } from '~/ui/components/form/FormTextInput';
import { Button } from '~/ui/components/button/Button';
import { requireParam } from '~/utils/params/params.server';
import { requireDeveloper } from '~/utils/auth/session.server';
import { prisma } from '~/utils/prisma/prisma.server';
import { DateTime } from 'luxon';
import { requireFormDataField } from '~/utils/form/formdata.server';
import { flashMessage } from '~/utils/flash/flashmessages.server';

export const loader = async () => {
    const secret = await generateSecret();
    return json({ secret });
};

export const action = async ({ request, params }: DataFunctionArgs) => {
    const applicationId = requireParam('applicationId', params);
    const user = await requireDeveloper(request);
    const formData = await request.formData();
    const applicationSecretName = requireFormDataField(
        formData,
        'applicationSecretName',
        'Please provide a name for the secret'
    );
    const applicationSecret = requireFormDataField(
        formData,
        'applicationSecret',
        'Please provide a valid secret'
    );

    await prisma.secret.create({
        data: {
            name: applicationSecretName,
            secret: applicationSecret,
            lastCharacters: applicationSecret.slice(-4),
            createdAt: DateTime.now().toSeconds(),
            applicationId,
        },
    });
    //In order to redirect
    const redirectionUrl = request.url.substring(0, request.url.lastIndexOf('/'));
    return redirect(`${redirectionUrl}`, {
        headers: {
            'Set-Cookie': await flashMessage(request, {
                message: 'Secret created',
                type: 'success',
            }),
        },
    });
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
