import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
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
            <Switch>
                <Route exact path="/">
                    <Home isLoggedIn={isLoggedIn} />
                </Route>
                <Route exact path="/profile">
                    {isLoggedIn && userObj ? (
                        <Profile userObj={userObj} />
                    ) : (
                        <Redirect to="/" />
                    )}
                </Route>
                <Route
                    exact
                    path="/detail/:id"
                    render={(props) => (
                        <ChoiceInfo
                            {...props}
                            userObj={userObj}
                            isLoggedIn={isLoggedIn}
                        />
                    )}
                />
                <Route exact path="/upload">
                    {isLoggedIn && userObj ? (
                        <Upload
                            userObj={userObj}
                            onStartUpload={() => setAlertType("upload")}
                            onCompleteUpload={handleCompleteUpload}
                        />
                    ) : (
                        <Redirect to="/" />
                    )}
                </Route>
            </Switch>
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
