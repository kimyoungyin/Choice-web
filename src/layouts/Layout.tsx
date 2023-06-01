import Notification from "components/Notification";
import Header from "components/Header";
import { Outlet } from "react-router";
import { Box } from "@chakra-ui/react";

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
    return (
        <>
            <Header
                isLoggedIn={isLoggedIn}
                userObj={userObj}
                setLoggedInState={setLoggedInState}
            />
            <Box w={"full"} h={"full"} maxW={1440}>
                <Outlet />
            </Box>
            {alertType && (
                <Notification isOpen={isAlertOn} status={alertType} />
            )}
        </>
    );
};

export default Layout;
