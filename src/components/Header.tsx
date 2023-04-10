import customAixos from "customAixos";
import { authService, firebaseInstance } from "fb";

interface HeaderProps {
    isLoggedIn: boolean;
    setLoggedInState: (state: boolean) => void;
}

const Header = ({ isLoggedIn, setLoggedInState }: HeaderProps) => {
    const logoutHandler = () => {
        setLoggedInState(false);
        authService.signOut();
        delete customAixos.defaults.headers.common["Authorization"];
    };

    const loginHandler = async () => {
        let provider;
        try {
            provider = new firebaseInstance.auth.GoogleAuthProvider();
            await authService.signInWithPopup(provider);
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
