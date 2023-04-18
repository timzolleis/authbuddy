import { Form, Link, Outlet, useLoaderData } from '@remix-run/react';
import { Button } from '~/ui/components/button/Button';
import { DataFunctionArgs, json } from '@remix-run/node';
import { requireParam } from '~/utils/params/params.server';
import { findApplication, requireUserApplication } from '~/utils/prisma/models/application.server';
import { requireDeveloper } from '~/utils/auth/session.server';
import { DangerIcon } from '~/ui/icons/DangerIcon';
import { useState } from 'react';
import { EyeIcon } from '~/ui/icons/EyeIcon';
import { getRedactedString } from '~/utils/hooks/user';
import { prisma } from '~/utils/prisma/prisma.server';
import { hashSecret } from '~/utils/encryption/secret.server';
import { Secret } from '.prisma/client';
import { DateTime } from 'luxon';
import { CopyIcon } from '~/ui/icons/CopyIcon';

export const loader = async ({ params, request }: DataFunctionArgs) => {
    const applicationId = requireParam('applicationId', params);
    const user = await requireDeveloper(request);
    const application = await requireUserApplication(applicationId, user.id, true);
    return json({ application });
};

export const action = async ({ request, params }: DataFunctionArgs) => {
    const applicationId = requireParam('applicationId', params);
    const user = await requireDeveloper(request);
    const formData = await request.formData();
    const intent = formData.get('intent')?.toString();
    const secretId = formData.get('secretId')?.toString();
    const application = await findApplication(applicationId, true, user.id);
    if (!secretId) {
        throw new Error('Missing secret ID');
    }
    const secret = await prisma.secret.findUnique({
        where: {
            id: secretId,
        },
    });
    if (intent === 'revoke' && secret) {
        await prisma.secret.delete({
            where: {
                id: secretId,
            },
        });
        return json({ message: 'Secret revoked' });
    }
    if (intent === 'hide' && secret) {
        await prisma.secret.update({
            where: {
                id: secretId,
            },
            data: {
                secret: await hashSecret(secret.secret),
                hidden: true,
            },
        });
    }
    return null;
};

const ApplicationSecretsPage = () => {
    const { application } = useLoaderData<typeof loader>();

    return (
        <section className={'flex'}>
            <Outlet></Outlet>
            <div className={'flex w-full items-start justify-center gap-5'}>
                <Form method={'POST'} className={'grid w-full gap-2 md:w-1/2'}>
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
                        environment variables, since they will be hashed in the database too and can
                        not be read again.
                    </p>
                    {application.secrets.length > 0 ? (
                        application.secrets.map((secret) => (
                            <SecretComponent key={secret.id} secret={secret} />
                        ))
                    ) : (
                        <NoClientSecrets />
                    )}
                </Form>
            </div>
        </section>
    );
};

const SecretComponent = ({ secret }: { secret: Secret }) => {
    const [showSecret, setShowSecret] = useState(false);
    const copySecret = () => {
        if (!secret.hidden) {
            navigator.clipboard.writeText(secret.secret);
        }
    };

    return (
        <div className={'flex items-center justify-between rounded-md border border-white/30 p-4'}>
            <span>
                <span className={'flex items-center gap-2'}>
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
                <p className={'text-sm text-neutral-400'}>
                    {secret.hidden
                        ? 'This secret is already hidden and cannot be revealed again'
                        : showSecret
                        ? secret.secret
                        : getRedactedString()}
                </p>
                <span className={'flex items-center gap-1 text-sm text-neutral-400'}>
                    <p>Created:</p>
                    <p>
                        {DateTime.fromSeconds(secret.createdAt).toLocaleString(
                            DateTime.DATETIME_MED
                        )}
                    </p>
                </span>
            </span>

            <Form method={'POST'}>
                <span className={'space-x-2'}>
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
