import { DataFunctionArgs, json, redirect } from '@remix-run/node';
import { prisma } from '~/utils/prisma/prisma.server';
import { Form, Link, useLoaderData, useSearchParams } from '@remix-run/react';
import { PageHeader } from '~/ui/components/page/PageHeader';
import { Button } from '~/ui/components/button/Button';
import {
    ApplicationFormComponent,
    validateApplicationFormData,
} from '~/routes/applications.new/route';
import { requireDeveloper } from '~/utils/auth/session.server';
import { DangerZone, DangerZoneAction } from '~/ui/components/common/DangerZone';
import { useModal } from '~/ui/components/modal/Modal';
import { ConfirmDangerousActionModal } from '~/ui/components/modal/ConfirmDangerousActionModal';
import { useEffect } from 'react';
import { Badge } from '~/ui/components/common/Badge';

import {
    changeApplicationStatus,
    deleteApplication,
} from '~/utils/prisma/models/application.server';
import {
    Action,
    getAction,
    isAction,
} from '~/routes/applications.$applicationId.settings/applicationActions';

export const loader = async ({ request, params }: DataFunctionArgs) => {
    const user = await requireDeveloper(request);
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
    const user = await requireDeveloper(request);
    const applicationId = params.applicationId;
    if (!applicationId) {
        throw new Error('No application ID');
    }
    //Handle normal actions such as updating the application
    const formData = await request.formData();
    if (formData.get('intent')?.toString() === 'update') {
        const validatedFormData = validateApplicationFormData(formData);
        await prisma.application.update({
            where: {
                id_userId: {
                    userId: user.id,
                    id: applicationId,
                },
            },
            data: {
                name: validatedFormData.applicationName,
                description: validatedFormData.applicationDescription,
                homepage: validatedFormData.applicationUrl,
                redirectUrl: validatedFormData.applicationCallbackUrl,
            },
        });
    }
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    //Handle danger zone actions such as deletion and deactivation/reactivation
    if (action) {
        const resetAction = () => {
            url.searchParams.delete('action');
        };
        switch (action) {
            case 'delete': {
                await deleteApplication(applicationId, user.id);
                return redirect('/applications');
            }
            case 'deactivate': {
                await changeApplicationStatus(applicationId, user.id, true);
                resetAction();
                return redirect(url.toString());
            }
            case 'reactivate': {
                await changeApplicationStatus(applicationId, user.id, false);
                resetAction();
                return redirect(url.toString());
            }
        }
    }
    return json({ message: 'action performed' });
};

const ApplicationPage = () => {
    const { application } = useLoaderData<typeof loader>();
    const { showModal, toggleModal, setShowModal } = useModal();
    const [searchParams, setSearchParams] = useSearchParams();
    const action = searchParams.get('action');
    const setAction = (actionName: Action) => {
        searchParams.set('action', actionName);
        setSearchParams(searchParams);
    };
    const unsetAction = () => {
        searchParams.delete('action');
        setSearchParams(searchParams);
    };

    useEffect(() => {
        const action = searchParams.get('action');
        if (action && isAction(action)) {
            setShowModal(true);
        }
        if (!action) {
            setShowModal(false);
        }
    }, [searchParams]);

    return (
        <section className={'flex'}>
            <div className={'flex w-full items-start justify-center gap-5'}>
                <Form method={'POST'} className={'grid w-full gap-2 md:w-1/2'}>
                    <span className={'flex flex-col items-start justify-start'}>
                        <p className={'text-sm text-neutral-500'}> Application</p>
                        <PageHeader>{application.name}</PageHeader>
                        <Badge
                            text={application.deactivated ? 'Not active' : 'Active'}
                            color={application.deactivated ? 'red' : 'green'}></Badge>
                    </span>
                    <ApplicationFormComponent application={application} />
                    <div className={'flex items-center gap-2 border-t border-t-white/30 py-2'}>
                        <Button value={'update'} width={'normal'}>
                            Save changes
                        </Button>
                        <Link to={'/applications'}>
                            <Button color={'secondary'}>Cancel</Button>
                        </Link>
                    </div>
                    <DangerZone>
                        <DangerZoneAction
                            name={'Delete your application'}
                            description={
                                'This will delete your application. This action cannot be reversed'
                            }
                            buttonName={'Delete'}
                            onClick={() => setAction('delete')}></DangerZoneAction>

                        {application.deactivated ? (
                            <DangerZoneAction
                                name={'Reactivate your application'}
                                description={
                                    'This will reactivate your application. Users will again be able to use services that rely on this application'
                                }
                                buttonName={'Reactivate'}
                                onClick={() => setAction('reactivate')}></DangerZoneAction>
                        ) : (
                            <DangerZoneAction
                                name={'Deactivate your application'}
                                description={
                                    'This will deactivate your application. Users will no longer be able to authenticate using services that rely on this application'
                                }
                                buttonName={'Deactivate'}
                                onClick={() => setAction('deactivate')}></DangerZoneAction>
                        )}
                    </DangerZone>
                </Form>
                <Form method={'POST'}>
                    <ConfirmDangerousActionModal
                        onCancel={unsetAction}
                        phraseToMatch={
                            action
                                ? `${application.name}/${getAction(action).phraseToMatch}`
                                : 'dangerous-action'
                        }
                        actionName={getAction(action).actionName}
                        showModal={showModal}
                        toggleModal={unsetAction}
                        doesSubmit={true}
                        submissionValue={getAction(action).phraseToMatch}
                    />
                </Form>
            </div>
        </section>
    );
};

export default ApplicationPage;
