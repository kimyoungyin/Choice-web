import { Link } from "react-router-dom";

interface NavigationProps {
    isLoggedIn: boolean;
}

const Navigation = ({ isLoggedIn }: NavigationProps) => {
    return (
        <nav className="Navigation">
            <ul className="Navigation-ul">
                <li>
                    <Link replace className="Navigation-Link" to="/">
                        HOME
                    </Link>
                </li>
                {isLoggedIn && (
                    <li>
                        <Link replace className="Navigation-Link" to="/profile">
                            PROFILE
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navigation;
