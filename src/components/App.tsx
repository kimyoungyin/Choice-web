import { useEffect, useState } from "react";

import { Flex, Spinner, useColorModeValue } from "@chakra-ui/react";

import AppRouter from "components/Router";
import { auth } from "fb";
import { onAuthStateChanged } from "firebase/auth";
import "style.css";

const App = () => {
    const [init, setInit] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userObj, setUserObj] = useState<global.User | null>(null);
    const bgColor = useColorModeValue("gray.200", "gray.700");

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
        <Flex
            align={"center"}
            justify={"center"}
            bgColor={bgColor}
            h={"full"}
            w={"full"}
            className="App"
        >
            {init ? (
                <AppRouter
                    isLoggedIn={isLoggedIn}
                    userObj={userObj}
                    setLoggedInState={(state) => setIsLoggedIn(state)}
                />
            ) : (
                <Spinner size={"xl"} />
            )}
        </Flex>
    );
};

export default App;
