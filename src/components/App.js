import React, { useEffect, useState } from "react";
import AppRouter from "./Router";
import "../CSS/App.css";
import { authService } from "../fb";
function App() {
    const [init, setInit] = useState(false);
    const [isLoggedin, setIsLoggedIn] = useState(false);
    const [userObj, setUserObj] = useState(null);

    useEffect(() => {
        authService.onAuthStateChanged((user) => {
            if (user) {
                setIsLoggedIn(true);
                setUserObj({
                    displayName: user.displayName,
                    uid: user.uid,
                    email: user.email,
                });
            } else {
                setIsLoggedIn(false);
            }
            setInit(true);
        });
    }, [init]);
    return (
        <div className="App">
            {init ? (
                <AppRouter isLoggedin={isLoggedin} userObj={userObj} />
            ) : (
                <div>로딩중</div>
            )}
        </div>
    );
}

export default App;
