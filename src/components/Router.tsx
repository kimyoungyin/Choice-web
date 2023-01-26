import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { UserObj } from "components/App";
import Auth from "routes/Auth";
import Title from "components/Title";
import Home from "routes/Home";
import Profile from "routes/Profile";
import ChoiceInfo from "routes/ChoiceInfo";
import Navigation from "components/Navigation";

interface AppRouterProps {
    isLoggedIn: boolean;
    userObj: UserObj;
}

const AppRouter = ({ isLoggedIn, userObj }: AppRouterProps) => {
    return (
        <Router>
            <div className="Router">
                {isLoggedIn && <Title />}
                {isLoggedIn ? (
                    <Switch>
                        <Route exact path="/">
                            <Home userObj={userObj} />
                        </Route>
                        <Route exact path="/profile">
                            <Profile userObj={userObj} />
                        </Route>
                        <Route
                            exact
                            path="/detail/:id" // 자동으로 render props,match.id 타입 생성해줌
                            render={(props) => (
                                <ChoiceInfo {...props} userObj={userObj} />
                            )}
                        />
                        {/* <Route
                            exact
                            path="/detail"
                            render={(props) => (
                                <ChoiceInfo {...props} userObj={userObj} />
                            )}
                        /> */}
                    </Switch>
                ) : (
                    <Switch>
                        <Route exact path="/">
                            <Auth />
                        </Route>
                    </Switch>
                )}
                {isLoggedIn && <Navigation />}
            </div>
        </Router>
    );
};

export default AppRouter;
