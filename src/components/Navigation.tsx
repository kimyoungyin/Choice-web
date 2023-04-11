import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
    const { pathname } = useLocation();

    return (
        <nav className="Navigation">
            <ul className="Navigation-ul">
                {pathname !== "/" && (
                    <li>
                        <Link replace className="Navigation-Link" to="/">
                            HOME
                        </Link>
                    </li>
                )}
                {pathname !== "/profile" && (
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
