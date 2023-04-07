import { Link } from "react-router-dom";

const Navigation = () => {
    return (
        <nav className="Navigation">
            <ul className="Navigation-ul">
                <li>
                    <Link replace className="Navigation-Link" to="/">
                        HOME
                    </Link>
                </li>
                <li>
                    <Link replace className="Navigation-Link" to="/profile">
                        PROFILE
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navigation;
