import { SyntheticEvent, useState } from "react";

import { Image, Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";

interface FullImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    src: string;
}

const FullImageModal = ({ isOpen, onClose, src }: FullImageModalProps) => {
    const [isWidthBiggerThanHeight, setIsWidthBiggerThanHeight] =
        useState(true);

    const handleImageState = (
        event: SyntheticEvent<HTMLImageElement, Event>
    ) => {
        const { width, height } = event.target as HTMLImageElement;
        setIsWidthBiggerThanHeight(width >= height);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent
                onClick={onClose}
                display={"flex"}
                alignItems={"center"}
                backgroundColor={"transparent"}
                boxShadow={"none"}
                w={isWidthBiggerThanHeight ? "60%" : "auto"}
                h={isWidthBiggerThanHeight ? "auto" : "60%"}
            >
                <Image
                    src={src}
                    w={isWidthBiggerThanHeight ? "full" : undefined}
                    h={isWidthBiggerThanHeight ? undefined : "full"}
                    onLoad={handleImageState}
                />
            </ModalContent>
        </Modal>
    );
};

export default FullImageModal;
