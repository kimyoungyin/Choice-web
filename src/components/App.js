import React, { useEffect, useState } from "react";
import AppRouter from "./Router";
import "../style.css";
import { authService } from "../fb";
import customAixos from "../customAixos";
function App() {
    const [init, setInit] = useState(false);
    const [isLoggedin, setIsLoggedIn] = useState(false);
    const [userObj, setUserObj] = useState(null);

    useEffect(() => {
        const unsubscribe = authService.onAuthStateChanged((user) => {
            if (user) {
                // customAixos
                //     .post("/posts", {
                //         uploaderId: user.uid,
                //         categoryName: "음악",
                //         title: "공부할 때 듣기 좋은 음악 장르",
                //         choice1: "발라드",
                //         choice2: "힙합",
                //     })
                //     .then((result) => console.log(result))
                //     .catch(
                //         (error) =>
                //             console.log(
                //                 "error:",
                //                 error.response.status,
                //                 error.response.data
                //             ) // 로그인 화면으로 이동 및 로그아웃
                //     );
                setIsLoggedIn(true);
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
            {init ? (
                <AppRouter isLoggedin={isLoggedin} userObj={userObj} />
            ) : (
                <div className="loader"></div>
            )}
        </div>
    );
}

export default App;
