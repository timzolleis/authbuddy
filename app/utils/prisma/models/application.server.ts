import { prisma } from '~/utils/prisma/prisma.server';
import { InsufficientPermissionsException } from '~/exception/InsufficientPermissionsException';
import { Application } from '.prisma/client';

export async function requireApplicationOwnership(applicationId: string, userId: string) {
    const application = await prisma.application.findUnique({
        where: {
            id_userId: {
                userId,
                id: applicationId,
            },
        },
    });
    if (!application) {
        throw new InsufficientPermissionsException('Application ownership');
    }
    return application;
}

export async function findApplication(
    applicationId: string,
    userId?: string,
    includeSecrets?: boolean
) {
    if (userId) {
        return prisma.application.findUnique({
            where: {
                id_userId: {
                    userId,
                    id: applicationId,
                },
            },
            include: {
                secrets: includeSecrets,
                imageAttribution: true,
            },
        });
    }
    return prisma.application.findUnique({
        where: {
            id: applicationId,
        },
        include: {
            secrets: includeSecrets,
            imageAttribution: true,
        },
    });
}

export async function requireUserApplication(
    applicationId: string,
    userId: string,
    includeSecrets = false
) {
    const application = await prisma.application.findUnique({
        where: {
            id_userId: {
                id: applicationId,
                userId: userId,
            },
        },
        include: {
            secrets: includeSecrets,
            imageAttribution: true,
        },
    });

    if (application === null) {
        throw new Error('The application does not exist');
    }
    return application;
}

export async function changeApplicationStatus(
    applicationId: string,
    userId: string,
    deactivated: boolean
) {
    return prisma.application
        .update({
            where: {
                id_userId: {
                    id: applicationId,
                    userId: userId,
                },
            },
            data: {
                deactivated,
            },
        })
        .catch();
}

export async function deleteApplication(applicationId: string, userId: string) {
    return prisma.application
        .delete({
            where: {
                id_userId: {
                    userId,
                    id: applicationId,
                },
            },
        })
        .catch();
}

export async function createImageAttribution({
    applicationId,
    authorName,
    authorUrl,
    platformName,
    platformUrl,
}: {
    applicationId: Application['id'];
    authorName: string;
    authorUrl: string;
    platformName: string;
    platformUrl: string;
}) {
    return prisma.imageAttribution.upsert({
        where: { applicationId },
        create: { applicationId, authorName, authorUrl, platformName, platformUrl },
        update: { authorName, authorUrl, platformName, platformUrl },
    });
}
