import { commitAuthbuddySession, getAuthbuddySession } from '~/utils/flash/session.server';

type MessageType = 'normal' | 'action' | 'success' | 'error' | 'loading';

export type FlashMessage = {
    message: string;
    type: MessageType;
};

export async function flashMessage(request: Request, { message, type }: FlashMessage) {
    const session = await getAuthbuddySession(request);
    session.flash('flashMessage', { message, type });
    return await commitAuthbuddySession(session);
}

export async function getFlashMessage(request: Request) {
    const session = await getAuthbuddySession(request);
    const message = session.get('flashMessage') as FlashMessage | undefined;
    const header = await commitAuthbuddySession(session);
    return { message, header };
}
