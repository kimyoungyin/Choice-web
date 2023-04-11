import customAixos from "customAixos";
import { auth } from "fb";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

interface HeaderProps {
    isLoggedIn: boolean;
    setLoggedInState: (state: boolean) => void;
}

const Header = ({ isLoggedIn, setLoggedInState }: HeaderProps) => {
    const logoutHandler = () => {
        setLoggedInState(false);
        signOut(auth);
        delete customAixos.defaults.headers.common["Authorization"];
    };

    const loginHandler = async () => {
        let provider;
        try {
            provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            setLoggedInState(true);
        } catch (err) {
            // error의 타입 정의하기
            if (!(err instanceof Error)) return;
            console.log(err);
        }
    };

    return (
        <div className="Title">
            CHOICEWEB
            <button onClick={isLoggedIn ? logoutHandler : loginHandler}>
                {isLoggedIn ? "LOGOUT" : "LOGIN WITH GOOGLE"}
            </button>
        </div>
    );
};

export default Header;
