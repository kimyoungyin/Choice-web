import { auth } from "fb";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

type OnLoginType = () => void;

const useGoogleLogin = (onLogin: OnLoginType) => async () => {
    let provider;
    try {
        provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        onLogin();
    } catch (err) {
        // error의 타입 정의하기
        if (!(err instanceof Error)) return;
        console.log(err);
    }
};

export default useGoogleLogin;
