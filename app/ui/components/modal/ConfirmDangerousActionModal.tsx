import { b } from 'vite-node/types-63205a44';
import { Modal } from '~/ui/components/modal/Modal';
import { TextInput } from '@tremor/react';
import { Button } from '~/ui/components/button/Button';
import { tr } from 'date-fns/locale';
import { useState } from 'react';

type ConfirmDangerousActionModalProps = {
    showModal: boolean;
    toggleModal: () => void;
    actionName: string;
    phraseToMatch: string;
    onConfirm?: () => any;
    onCancel: () => any;
    doesSubmit?: boolean;
    submissionValue?: string;
};

function checkForMatch(phraseToMatch: string, phrase: string) {
    return phraseToMatch === phrase;
}

export const ConfirmDangerousActionModal = ({
    doesSubmit = false,
    showModal,
    toggleModal,
    actionName,
    phraseToMatch,
    onConfirm,
    onCancel,
    submissionValue,
}: ConfirmDangerousActionModalProps) => {
    const [matches, setMatches] = useState(false);

    return (
        <Modal showModal={showModal} toggleModal={toggleModal}>
            <p className={'border-b border-b-white/30 py-1 font-medium'}>{actionName}</p>
            <p className={'mt-2 text-sm text-neutral-400'}>
                Do you really want to perform this action? Please be cautious about it. To perform
                it, type <span className={'font-medium text-white'}>{phraseToMatch}</span> in the
                field below
            </p>
            <TextInput
                onChange={(e) => setMatches(checkForMatch(phraseToMatch, e.target.value))}
                className={'mt-2 border-white/30 bg-neutral-800 hover:bg-black'}
                placeholder={phraseToMatch}></TextInput>
            <div className={'flex justify-end'}>
                <span className={'mt-5 flex items-center gap-2'}>
                    <Button
                        value={submissionValue}
                        type={doesSubmit ? 'submit' : 'button'}
                        onClick={doesSubmit ? undefined : onConfirm}
                        disabled={!matches}>
                        Confirm
                    </Button>
                    <Button type={'button'} onClick={() => onCancel()} color={'secondary'}>
                        Cancel
                    </Button>
                </span>
            </div>
        </Modal>
    );
};
