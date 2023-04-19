import { prisma } from '~/utils/prisma/prisma.server';
import { hashSecret } from '~/utils/encryption/secret.server';
import { EntityNotFoundException } from '~/exception/EntityNotFoundException';

export async function findSecret(secretId: string) {
    return prisma.secret.findUnique({
        where: {
            id: secretId,
        },
    });
}

export async function hideSecret(secretId: string) {
    const secret = await findSecret(secretId);
    if (!secret) {
        throw new EntityNotFoundException('secret');
    }
    return prisma.secret.update({
        where: {
            id: secretId,
        },
        data: {
            secret: await hashSecret(secret.secret),
            hidden: true,
        },
    });
}

export async function revokeSecret(secretId: string) {
    return prisma.secret.delete({
        where: {
            id: secretId,
        },
    });
}
