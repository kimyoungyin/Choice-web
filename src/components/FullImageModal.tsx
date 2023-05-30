import { Image, Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";

interface FullImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    src: string;
}

const FullImageModal = ({ isOpen, onClose, src }: FullImageModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent onClick={onClose}>
                <Image src={src} />
            </ModalContent>
        </Modal>
    );
};

export default FullImageModal;
