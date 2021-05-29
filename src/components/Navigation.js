import React from "react";
import { Link } from "react-router-dom";
import "../CSS/Navigation.css";

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
