import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Auth from "routes/Auth";
import Title from "components/Title";
import Home from "routes/Home";
import Profile from "routes/Profile";
import ChoiceInfo from "routes/ChoiceInfo";
import Navigation from "components/Navigation";
import Upload from "routes/Upload";
import { useState } from "react";
import Alert from "components/Alert";

interface AppRouterProps {
    isLoggedIn: boolean;
    userObj: global.User | null;
}

const AppRouter = ({ isLoggedIn, userObj }: AppRouterProps) => {
    const [alertType, setAlertType] = useState<"upload" | "complete" | null>(
        null
    );

    const handleCompleteUpload = () => {
        setAlertType("complete");
        setTimeout(() => setAlertType(null), 2000);
    };

    return (
        <Router>
            {isLoggedIn && <Title />}
            {isLoggedIn && userObj ? (
                <Switch>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route exact path="/profile">
                        <Profile userObj={userObj} />
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
                    />{" "}
                    <Route exact path="/upload">
                        <Upload
                            userObj={userObj}
                            onStartUpload={() => setAlertType("upload")}
                            onCompleteUpload={handleCompleteUpload}
                        />
                    </Route>
                </Switch>
            ) : (
                <Switch>
                    <Route exact path="/">
                        <Auth />
                    </Route>
                </Switch>
            )}
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
