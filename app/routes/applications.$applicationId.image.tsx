import { DataFunctionArgs, json } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { PageHeader } from '~/components/ui/PageHeader';
import { requireDeveloper } from '~/utils/auth/session.server';

import { createImageAttribution, findApplication } from '~/utils/prisma/models/application.server';
import { requireResult } from '~/utils/general-utils.server';
import { getRandomPhoto } from '~/utils/unsplash/unsplash.server';
import { requireParameter } from '~/utils/params/params.server';
import { prisma } from '~/utils/prisma/prisma.server';
import { Label } from '~/components/ui/Label';
import { Input } from '~/ui/components/form/Input';
import { Button } from '~/components/ui/Button';
//TODO: ADD IMAGE UPLOAD
export const loader = async ({ request, params }: DataFunctionArgs) => {
    const user = await requireDeveloper(request);
    const applicationId = requireParameter('applicationId', params);
    const application = await findApplication(applicationId, user.id).then(requireResult);
    if (!application.imageUrl) {
        const photo = await getRandomPhoto();
        await prisma.application.update({
            where: { id: applicationId },
            data: { imageUrl: photo.url },
        });
        await createImageAttribution({
            applicationId,
            authorName: photo.authorName,
            authorUrl: photo.authorUrl,
            platformName: photo.platformName,
            platformUrl: photo.platformUrl,
        });
    }
    return json({ application });
};

const ApplicationPage = () => {
    const { application } = useLoaderData<typeof loader>();
    return (
        <div className={'flex w-full items-start justify-center gap-6'}>
            <Form method={'POST'} className={'w-full space-y-4'}>
                <div className={'flex flex-col items-start justify-start'}>
                    <PageHeader>Application image</PageHeader>
                    <p className={'text-sm text-muted-foreground'}>
                        The logo will be displayed to all users that use AuthBuddy to authenticate
                        with your app.
                    </p>
                </div>
                <ImagePreview imageUrl={application.imageUrl} />
                <div>
                    <h2 className={'mt-2 text-2xl font-semibold'}>Image attribution</h2>
                    <p className={'text-sm text-muted-foreground'}>
                        If your image needs attribution because its license requires so, you can add
                        the authors attribution here. If you do not enter any values, previous
                        attributions will be deleted and the application will assume that you have a
                        valid license or ownership for/of the image.
                    </p>
                </div>
                <div className={'grid grid-cols-2 gap-4'}>
                    <div>
                        <Label>Author name</Label>
                        <Input defaultValue={application.imageAttribution?.authorName} />
                    </div>
                    <div>
                        <Label>Author profile URL</Label>
                        <Input defaultValue={application.imageAttribution?.authorUrl} />
                    </div>
                    <div>
                        <Label>Platform name</Label>
                        <Input defaultValue={application.imageAttribution?.platformName} />
                    </div>
                    <div>
                        <Label>Platform URL</Label>
                        <Input defaultValue={application.imageAttribution?.platformUrl} />
                    </div>
                </div>
                <div className={'flex w-full justify-end gap-2'}>
                    <Button value={'randomImage'} variant={'secondary'}>
                        Random image
                    </Button>
                    <Button value={'save'}>Save</Button>
                </div>
            </Form>
        </div>
    );
};

const ImagePreview = ({ imageUrl }: { imageUrl: string | null }) => {
    return (
        <div className={'flex w-full items-end gap-2'}>
            <img
                className={'h-48 w-48 rounded-full object-cover'}
                src={imageUrl ?? undefined}
                alt=''
            />
            <img
                className={'h-36 w-36 rounded-full object-cover'}
                src={imageUrl ?? undefined}
                alt=''
            />
            <img
                className={'h-20 w-20 rounded-full object-cover'}
                src={imageUrl ?? undefined}
                alt=''
            />
            <img
                className={'h-14 w-14 rounded-full object-cover'}
                src={imageUrl ?? undefined}
                alt=''
            />
        </div>
    );
};

export default ApplicationPage;
