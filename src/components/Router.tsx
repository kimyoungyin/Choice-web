import { useState } from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
} from "react-router-dom";

import { useDisclosure } from "@chakra-ui/react";

import Layout from "layouts/Layout";
import ChoiceInfo from "routes/ChoiceInfo";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Upload from "routes/Upload";

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
                    <Route path="/" element={<Home />} />
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
                                onLogin={() => setLoggedInState(true)}
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
