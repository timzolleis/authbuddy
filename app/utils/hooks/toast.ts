import { FlashMessage } from '~/utils/flash/flashmessages.server';
import { toast } from 'sonner';

export function toastMessage(message: FlashMessage) {
    switch (message.type) {
        case 'normal': {
            toast(message.message);
            break;
        }
        case 'action': {
            toast(message.message, {
                action: {
                    label: 'Undo',
                    onClick: () => console.log('Undo'),
                },
            });
            break;
        }
        case 'success': {
            toast.success(message.message);
            break;
        }
        case 'error': {
            toast.error(message.message);
            break;
        }
    }
}