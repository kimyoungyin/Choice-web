import { Alert, AlertIcon, AlertTitle, Slide } from "@chakra-ui/react";

interface NotificationProps {
    status: global.Alert;
    isOpen: boolean;
}

const Notification = ({ status, isOpen }: NotificationProps) => {
    return (
        <Slide
            in={isOpen}
            direction="bottom"
            style={{ zIndex: 10, width: 250 }}
        >
            <Alert status={status === "upload" ? "loading" : "success"}>
                <AlertIcon />
                <AlertTitle>
                    {status === "upload" ? "업로드 중" : "업로드 완료"}
                </AlertTitle>
            </Alert>
        </Slide>
    );
};

export default Notification;
