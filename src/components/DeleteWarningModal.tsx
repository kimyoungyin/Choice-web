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
    onDelete: () => void;
    title: string;
}

const DeleteWarningModal = ({
    isOpen,
    onClose,
    onDelete,
    title,
}: DeleteWarningModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Q. {title}</ModalHeader>
                <ModalBody>이 질문을 정말 삭제하시겠습니까?</ModalBody>
                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose}>
                        취소
                    </Button>
                    <Button colorScheme="red" onClick={onDelete}>
                        삭제
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default DeleteWarningModal;
