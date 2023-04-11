import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
} from "react-router-dom";
import Home from "routes/Home";
import Profile from "routes/Profile";
import ChoiceInfo from "routes/ChoiceInfo";
import Navigation from "components/Navigation";
import Upload from "routes/Upload";
import { useState } from "react";
import Alert from "components/Alert";
import Header from "components/Header";

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
    const [alertType, setAlertType] = useState<"upload" | "complete" | null>(
        null
    );

    const handleCompleteUpload = () => {
        setAlertType("complete");
        setTimeout(() => setAlertType(null), 2000);
    };

    return (
        <Router>
            <Header
                isLoggedIn={isLoggedIn}
                setLoggedInState={(state) => setLoggedInState(state)}
            />
            <Routes>
                <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
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
                        <ChoiceInfo userObj={userObj} isLoggedIn={isLoggedIn} />
                    }
                />
                <Route
                    path="/upload"
                    element={
                        isLoggedIn && userObj ? (
                            <Upload
                                userObj={userObj}
                                onStartUpload={() => setAlertType("upload")}
                                onCompleteUpload={handleCompleteUpload}
                            />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    }
                />
            </Routes>
            {isLoggedIn && <Navigation />}
            {alertType && (
                <Alert
                    text={alertType === "upload" ? "업로드 중" : "업로드 완료"}
                    idText={alertType === "upload" ? "start" : "complete"}
                />
            )}
        </Router>
    );
};

export default AppRouter;
