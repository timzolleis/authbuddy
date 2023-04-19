import { prisma } from '~/utils/prisma/prisma.server';
import { tr } from 'date-fns/locale';
import { InsufficientPermissionsException } from '~/exception/InsufficientPermissionsException';

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

export async function findApplication(applicationId: string, requireUser = false, userId?: string) {
    if (requireUser) {
        if (!userId) {
            throw new Error('User ID is required');
        }
        return prisma.application.findUnique({
            where: {
                id_userId: {
                    userId,
                    id: applicationId,
                },
            },
        });
    }
    return prisma.application.findUnique({
        where: {
            id: applicationId,
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
