import { useState } from "react";

import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
} from "@chakra-ui/react";

interface DeleteWarningModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => Promise<void>;
    onFulfilled: () => void;
    title: string;
}

const DeleteWarningModal = ({
    isOpen,
    onClose,
    onDelete,
    onFulfilled,
    title,
}: DeleteWarningModalProps) => {
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);

    const deleteHandler = async () => {
        setIsDeleteLoading(true);
        try {
            await onDelete();
            setIsDeleteLoading(false);
            onFulfilled();
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Q. {title}</ModalHeader>
                <ModalBody>이 질문을 정말 삭제하시겠습니까?</ModalBody>
                <ModalFooter>
                    <Button
                        variant="ghost"
                        mr={3}
                        onClick={onClose}
                        isDisabled={isDeleteLoading}
                    >
                        취소
                    </Button>
                    <Button
                        colorScheme="red"
                        onClick={deleteHandler}
                        isDisabled={isDeleteLoading}
                        isLoading={isDeleteLoading}
                    >
                        삭제
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default DeleteWarningModal;
