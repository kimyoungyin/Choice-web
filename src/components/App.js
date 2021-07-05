import React, { useEffect, useState } from "react";
import AppRouter from "./Router";
import "../style.css";
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
          photo: user.photoURL,
        });
      } else {
        setIsLoggedIn(false); // 임시 변경
      }
      setInit(true);
    });
  }, [init]);
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
