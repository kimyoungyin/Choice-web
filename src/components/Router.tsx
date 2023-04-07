import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Auth from "routes/Auth";
import Title from "components/Title";
import Home from "routes/Home";
import Profile from "routes/Profile";
import ChoiceInfo from "routes/ChoiceInfo";
import Navigation from "components/Navigation";
import Upload from "routes/Upload";

interface AppRouterProps {
    isLoggedIn: boolean;
    userObj: global.User | null;
}

const AppRouter = ({ isLoggedIn, userObj }: AppRouterProps) => {
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
                        <Upload userObj={userObj} />
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
        </Router>
    );
};

export default AppRouter;
