import React, { useState } from "react";
import { firebaseInstance, authService } from "../fb";
import "../style.css";

const Auth = () => {
    const [errorMessage, setErrorMessage] = useState("");

    const onSocialGoogleClick = async () => {
        let provider;
        try {
            provider = new firebaseInstance.auth.GoogleAuthProvider();
            const data = await authService.signInWithPopup(provider);
            console.log(data);
        } catch (err) {
            if (
                err.message ===
                "An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address."
            ) {
                setErrorMessage("이미 같은 이메일의 계정이 있습니다");
            } else {
                setErrorMessage(err.message);
            }
        }
    };

    return (
        <div className="Auth">
            <div className="Auth-title"></div>
            <h2 className="Auth-greet">환영합니다</h2>
            <button className="Auth-google" onClick={onSocialGoogleClick}>
                Sign up with Google
            </button>
            <div>{errorMessage}</div>
        </div>
    );
};

export default Auth;
