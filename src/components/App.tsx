import AppRouter from "components/Router";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "fb";
import { Spinner } from "@chakra-ui/react";
import "style.css";

const App = () => {
    const [init, setInit] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userObj, setUserObj] = useState<global.User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
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
            {init ? (
                <AppRouter
                    isLoggedIn={isLoggedIn}
                    userObj={userObj}
                    setLoggedInState={(state) => setIsLoggedIn(state)}
                />
            ) : (
                <Spinner size={"xl"} />
            )}
        </div>
    );
};

export default App;
