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
            <ModalContent
                onClick={onClose}
                display={"flex"}
                alignItems={"center"}
                backgroundColor={"transparent"}
                boxShadow={"none"}
                w={"60%"}
                maxH={"90%"}
                overflow={"auto"}
            >
                <Image src={src} w={"full"} />
            </ModalContent>
        </Modal>
    );
};

export default FullImageModal;
