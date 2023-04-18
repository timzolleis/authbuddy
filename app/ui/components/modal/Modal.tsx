import React, { ReactNode, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CloseIcon } from '~/ui/icons/CloseIcon';

export const Modal = ({
    showModal,
    toggleModal,
    children,
}: {
    showModal: boolean;
    toggleModal: () => void;
    children: ReactNode;
}) => {
    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [showModal]);

    const closeModal = () => {
        if (document !== undefined) {
            document.body.style.overflow = 'auto';
            toggleModal();
        }
    };

    return (
        <>
            <AnimatePresence>
                {showModal ? (
                    <motion.div
                        key={showModal.toString()}
                        onClick={() => closeModal()}
                        className={
                            'fixed bottom-0 left-0 right-0 top-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-40 p-3 '
                        }
                        layout
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                            transition: {
                                duration: 0.1,
                                type: 'spring',
                                damping: 25,
                                stiffness: 500,
                            },
                        }}
                        exit={{ opacity: 0 }}>
                        <motion.section
                            layout
                            initial={{
                                opacity: 0,
                                y: 500,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                transition: {
                                    duration: 0.05,
                                    type: 'spring',
                                    damping: 25,
                                    stiffness: 500,
                                },
                            }}
                            exit={{ y: 500, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className={
                                'relative overflow-y-scroll rounded-xl border border-white/30 bg-neutral-900 lg:w-1/2 xl:w-1/3'
                            }>
                            <span className={'absolute right-0 p-3'}>
                                <CloseIcon
                                    onClick={() => closeModal()}
                                    hover={'pointer'}
                                    size={'sm'}
                                />
                            </span>

                            <div className={'px-5 py-5'}>{children}</div>
                        </motion.section>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </>
    );
};

export function useModal(showInitial: boolean = false) {
    const [showModal, setShowModal] = useState(showInitial);

    function toggleModal() {
        setShowModal(!showModal);
    }

    return { showModal, toggleModal, setShowModal };
}
