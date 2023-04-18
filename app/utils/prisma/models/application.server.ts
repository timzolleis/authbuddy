import { prisma } from '~/utils/prisma/prisma.server';
import { tr } from 'date-fns/locale';

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
