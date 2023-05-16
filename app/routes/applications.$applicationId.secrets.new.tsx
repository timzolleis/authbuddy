import { Modal } from '~/components/features/modal/Modal';
import { Form, useLoaderData, useNavigate, useRevalidator } from '@remix-run/react';
import { generateSecret } from '~/utils/encryption/secret.server';
import { DataFunctionArgs, json, redirect } from '@remix-run/node';
import { Input } from '~/components/ui/Input';
import { Button } from '~/components/ui/Button';
import { requireParameter } from '~/utils/general-utils.server';
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
    const applicationId = requireParameter('applicationId', params);
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
    return redirect(redirectionUrl, {
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
                <div className={'space-y-2'}>
                    <Input
                        name={'applicationSecretName'}
                        required={true}
                        placeholder={'My fancy secret #1'}
                        label={'Secret name'}
                    />
                    <Input
                        name={'applicationSecret'}
                        required={true}
                        placeholder={'secret'}
                        label={'Application secret'}
                        defaultValue={secret}
                    />
                    <span className={'flex justify-end gap-2'}>
                        <Button onClick={() => revalidate()} type={'button'} variant={'secondary'}>
                            Regenerate
                        </Button>
                        <Button>Create</Button>
                    </span>
                </div>
            </Form>
        </Modal>
    );
};

export default CreateApplicationSecretsPage;
