import { Form, Link, Outlet, useLoaderData } from '@remix-run/react';
import { Button } from '~/ui/components/button/Button';
import { DataFunctionArgs, json } from '@remix-run/node';
import { requireParam } from '~/utils/params/params.server';
import {
    findApplication,
    requireApplicationOwnership,
    requireUserApplication,
} from '~/utils/prisma/models/application.server';
import { requireDeveloper } from '~/utils/auth/session.server';
import { DangerIcon } from '~/ui/icons/DangerIcon';
import { useState } from 'react';
import { EyeIcon } from '~/ui/icons/EyeIcon';
import { getRedactedString } from '~/utils/hooks/user';
import { Secret } from '.prisma/client';
import { DateTime } from 'luxon';
import { CopyIcon } from '~/ui/icons/CopyIcon';
import { requireFormDataField } from '~/utils/form/formdata.server';
import { hideSecret, revokeSecret } from '~/utils/prisma/models/secret.server';
import { flashMessage } from '~/utils/flash/flashmessages.server';
import { ErrorComponent } from '~/ui/components/error/ErrorComponent';
import { EntityNotFoundException } from '~/exception/EntityNotFoundException';

export const loader = async ({ params, request }: DataFunctionArgs) => {
    const applicationId = requireParam('applicationId', params);
    const user = await requireDeveloper(request);
    const application = await findApplication(applicationId, user.id);
    if (!application) {
        throw new EntityNotFoundException('application');
    }
    return json({ application });
};

export const action = async ({ request, params }: DataFunctionArgs) => {
    const applicationId = requireParam('applicationId', params);
    const user = await requireDeveloper(request);
    await requireApplicationOwnership(applicationId, user.id);
    const formData = await request.formData();
    const intent = formData.get('intent')?.toString();
    const secretId = requireFormDataField(formData, 'secretId', 'Secret ID missing');
    if (intent === 'revoke') {
        await revokeSecret(secretId);
        return json(
            {},
            {
                headers: {
                    'Set-Cookie': await flashMessage(request, {
                        message: 'Secret revoked successfully',
                        type: 'success',
                    }),
                },
            }
        );
    }
    if (intent === 'hide') {
        await hideSecret(secretId);
        return json(
            {},
            {
                headers: {
                    'Set-Cookie': await flashMessage(request, {
                        message: 'Secret hidden successfully',
                        type: 'success',
                    }),
                },
            }
        );
    }
    return null;
};

const ApplicationSecretsPage = () => {
    const { application } = useLoaderData<typeof loader>();
    return (
        <section className={'flex'}>
            <Outlet></Outlet>
            <div className={'flex w-full items-start justify-center gap-5'}>
                <div className={'grid w-full gap-2'}>
                    <span
                        className={
                            'flex items-center justify-between border-b border-white/30 pb-2'
                        }>
                        <h3 className={'text-title-large font-medium'}>Client secrets</h3>
                        <Link to={'new'}>
                            <Button>Create new</Button>
                        </Link>
                    </span>
                    <p className={'text-sm text-neutral-400'}>
                        It is highly recommended to hide secrets after you've copied them into your
                        environment variables, since they will be hashed in the database and can not
                        be read again.
                    </p>
                    {application.secrets.length > 0 ? (
                        application.secrets.map((secret) => (
                            <SecretComponent key={secret.id} secret={secret} />
                        ))
                    ) : (
                        <ErrorComponent
                            headline={'No client secrets'}
                            description={'Add a new client secret to use your application.'}
                        />
                    )}
                </div>
            </div>
        </section>
    );
};

//TODO: Fix mobile styling of revealed secrets
const SecretComponent = ({ secret }: { secret: Secret }) => {
    const [showSecret, setShowSecret] = useState(false);
    const copySecret = () => {
        if (!secret.hidden) {
            navigator.clipboard.writeText(secret.secret);
        }
    };

    return (
        <div className={'flex items-center justify-between rounded-md border border-white/30 p-4'}>
            <div className={'min-w-0'}>
                <span className={'flex min-w-0 items-center gap-2'}>
                    <p>{secret.name}</p>
                    {secret.hidden ? null : (
                        <span className={'flex items-center gap-2'}>
                            <CopyIcon hover={'pointer'} onClick={() => copySecret()} />
                            <EyeIcon
                                onClick={() => setShowSecret(!showSecret)}
                                hover={'pointer'}></EyeIcon>
                        </span>
                    )}
                </span>
                <p className={'truncate text-sm text-neutral-400'}>
                    {secret.hidden
                        ? `${getRedactedString()}${secret.lastCharacters}`
                        : showSecret
                        ? secret.secret
                        : getRedactedString()}
                </p>
                {secret.hidden ? (
                    <p className={'text-xs text-neutral-400'}>
                        The major part of this secret has been hashed and cannot be revealed again.
                    </p>
                ) : null}
                <span className={'flex items-center gap-1 text-sm text-neutral-400'}>
                    <p>Created:</p>
                    <p>
                        {DateTime.fromSeconds(secret.createdAt).toLocaleString(
                            DateTime.DATETIME_MED
                        )}
                    </p>
                </span>
            </div>

            <Form method={'POST'} className={'min-w-max'}>
                <span className={'flex flex-col gap-2 space-x-2'}>
                    <input type='hidden' name={'secretId'} defaultValue={secret.id} />
                    {secret.hidden ? null : (
                        <Button value={'hide'} color={'secondary'} padding={'medium'}>
                            Hide secret
                        </Button>
                    )}
                    <Button value={'revoke'} color={'danger'} padding={'medium'}>
                        Revoke secret
                    </Button>
                </span>
            </Form>
        </div>
    );
};

const NoClientSecrets = () => {
    return (
        <main>
            <section className={'rounded border border-white/30 p-5 lg:p-10'}>
                <span className={'flex items-center gap-2'}>
                    <DangerIcon size={'sm'} />
                    <h1 className={'text-headline-medium font-bold'}>No client secrets</h1>
                </span>
                <p className={'text-sm text-neutral-300'}>
                    It looks like you dont have any client secrets.
                </p>
            </section>
        </main>
    );
};

export default ApplicationSecretsPage;
