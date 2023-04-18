import { Modal } from '~/ui/components/modal/Modal';
import { Form } from '@remix-run/react';
import { ModalProps } from '@tremor/react/dist/cjs/components/util-elements/Modal/Modal';

export const CreatSecretComponent = ({
    showModal,
    toggleModal,
}: {
    showModal: boolean;
    toggleModal: () => void;
}) => {
    return (
        <Modal toggleModal={toggleModal} showModal={showModal}>
            <Form>
                <h3>Create secret</h3>
            </Form>
        </Modal>
    );
};
