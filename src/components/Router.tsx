import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
} from "react-router-dom";
import Home from "routes/Home";
import Profile from "routes/Profile";
import ChoiceInfo from "routes/ChoiceInfo";
import Upload from "routes/Upload";
import { useState } from "react";
import Layout from "layouts/Layout";
import { useDisclosure } from "@chakra-ui/react";

interface AppRouterProps {
    isLoggedIn: boolean;
    userObj: global.User | null;
    setLoggedInState: (state: boolean) => void;
}

const AppRouter = ({
    isLoggedIn,
    userObj,
    setLoggedInState,
}: AppRouterProps) => {
    const [alertType, setAlertType] = useState<global.Alert>("upload");
    const { isOpen, onClose, onOpen } = useDisclosure();

    const handleStartUpload = () => {
        setAlertType("upload");
        onOpen();
    };

    const handleCompleteUpload = () => {
        setAlertType("complete");
        setTimeout(() => {
            onClose();
        }, 2000);
    };

    return (
        <Router>
            <Routes>
                <Route
                    element={
                        <Layout
                            userObj={userObj}
                            isLoggedIn={isLoggedIn}
                            setLoggedInState={setLoggedInState}
                            alertType={alertType}
                            isAlertOn={isOpen}
                        />
                    }
                >
                    <Route
                        path="/"
                        element={<Home isLoggedIn={isLoggedIn} />}
                    />
                    <Route
                        path="/profile"
                        element={
                            isLoggedIn && userObj ? (
                                <Profile userObj={userObj} />
                            ) : (
                                <Navigate to="/" replace />
                            )
                        }
                    />
                    <Route
                        path="/detail/:id"
                        element={
                            <ChoiceInfo
                                userObj={userObj}
                                isLoggedIn={isLoggedIn}
                            />
                        }
                    />
                    <Route
                        path="/upload"
                        element={
                            isLoggedIn && userObj ? (
                                <Upload
                                    userObj={userObj}
                                    onStartUpload={handleStartUpload}
                                    onCompleteUpload={handleCompleteUpload}
                                />
                            ) : (
                                <Navigate to="/" replace />
                            )
                        }
                    />
                </Route>
            </Routes>
        </Router>
    );
};

export default AppRouter;
