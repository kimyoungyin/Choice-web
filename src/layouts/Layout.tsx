import Notification from "components/Notification";
import Header from "components/Header";
import Navigation from "components/Navigation";
import { Outlet } from "react-router";

interface LayoutProps {
    isLoggedIn: boolean;
    setLoggedInState: (state: boolean) => void;
    alertType: global.Alert;
    isAlertOn: boolean;
}

const Layout = ({
    isLoggedIn,
    setLoggedInState,
    alertType,
    isAlertOn,
}: LayoutProps) => {
    return (
        <>
            <Header
                isLoggedIn={isLoggedIn}
                setLoggedInState={setLoggedInState}
            />
            <Outlet />
            {isLoggedIn && <Navigation />}
            {alertType && (
                <Notification isOpen={isAlertOn} status={alertType} />
            )}
        </>
    );
};

export default Layout;
