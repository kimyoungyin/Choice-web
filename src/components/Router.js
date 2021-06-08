import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Profile from "../routes/Profile";
import ChoiceInfo from "./ChoiceInfo";
import Navigation from "./Navigation";
import Title from "./Title";
const AppRouter = ({ isLoggedin, userObj }) => {
    return (
        <Router className="Router">
            {isLoggedin && <Title />}
            {isLoggedin ? (
                <Switch>
                    <Route exact path="/">
                        <Home userObj={userObj} />
                    </Route>
                    <Route exact path="/profile">
                        <Profile userObj={userObj} />
                    </Route>
                    <Route
                        exact
                        path="/detail/:id"
                        render={(props) => (
                            <ChoiceInfo {...props} userObj={userObj} />
                        )}
                    />
                    <Route
                        exact
                        path="/detail"
                        render={(props) => (
                            <ChoiceInfo {...props} userObj={userObj} />
                        )}
                    />
                </Switch>
            ) : (
                <Switch>
                    <Route>
                        <Auth exact path="/" />
                    </Route>
                </Switch>
            )}
            {isLoggedin && <Navigation />}
        </Router>
    );
};

export default AppRouter;
