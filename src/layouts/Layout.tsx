import { Outlet } from "react-router";
import { Link } from "react-router-dom";

import { AddIcon } from "@chakra-ui/icons";
import { Box, IconButton, useMediaQuery } from "@chakra-ui/react";

import Header from "components/Header";
import Notification from "components/Notification";

interface LayoutProps {
    isLoggedIn: boolean;
    userObj: global.User | null;
    setLoggedInState: (state: boolean) => void;
    alertType: global.Alert;
    isAlertOn: boolean;
}

const Layout = ({
    isLoggedIn,
    userObj,
    setLoggedInState,
    alertType,
    isAlertOn,
}: LayoutProps) => {
    const [isLargerThan1024] = useMediaQuery("(min-width: 1024px)");

    return (
        <>
            <Header
                isLoggedIn={isLoggedIn}
                userObj={userObj}
                setLoggedInState={setLoggedInState}
            />
            <Box w={"full"} h={"full"} maxW={1440} overflowY={"auto"}>
                <Outlet />
            </Box>
            {alertType && (
                <Notification isOpen={isAlertOn} status={alertType} />
            )}
            {isLoggedIn && userObj && !isLargerThan1024 && (
                <IconButton
                    variant={"solid"}
                    bg={"pink.500"}
                    color={"white"}
                    aria-label="Upload your post"
                    icon={<AddIcon />}
                    position={"fixed"}
                    bottom={4}
                    right={4}
                    zIndex={50}
                    borderRadius={"50%"}
                    w={"56px"}
                    h={"56px"}
                    fontSize={"xl"}
                    _hover={{ transform: "scale(1.05)" }}
                    as={Link}
                    to={"/upload"}
                    boxShadow={"md"}
                />
            )}
        </>
    );
};

export default Layout;
