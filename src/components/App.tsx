import AppRouter from "components/Router";
import { authService } from "fb";
import { useEffect, useState } from "react";

const App = () => {
    const [init, setInit] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userObj, setUserObj] = useState<global.User | null>(null);

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
                        photoUrl: user.photoURL,
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
                <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} />
            ) : (
                <div className="loader"></div>
            )}
        </div>
    );
};

export default App;
