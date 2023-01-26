import AppRouter from "components/Router";
import { authService } from "fb";
import { useEffect, useState } from "react";

export interface UserObj {
    displayName: string;
    uid: string;
    email: string;
    photo: string;
}

const App = () => {
    const [init, setInit] = useState(false);
    const [isLoggedin, setIsLoggedIn] = useState(false);
    const [userObj, setUserObj] = useState<UserObj | null>(null);

    useEffect(() => {
        const unsubscribe = authService.onAuthStateChanged((user) => {
            if (user) {
                setIsLoggedIn(true);
                user.displayName &&
                    user.email &&
                    user.photoURL &&
                    setUserObj({
                        displayName: user.displayName,
                        uid: user.uid,
                        email: user.email,
                        photo: user.photoURL,
                    });
            } else {
                setIsLoggedIn(false); // 임시 변경
            }
            setInit(true);
        });
        return unsubscribe;
    }, []);
    return (
        <div className="App">
            {init && userObj ? (
                <AppRouter isLoggedIn={isLoggedin} userObj={userObj} />
            ) : (
                <div className="loader"></div>
            )}
        </div>
    );
};

export default App;
