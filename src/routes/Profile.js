import React from "react";
import { useHistory } from "react-router";
import { authService } from "../fb";

const Profile = () => {
    const history = useHistory();
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    };

    return (
        <div className="Profile">
            <div>프로필</div>
            <button onClick={onLogOutClick}>LogOut</button>
        </div>
    );
};

export default Profile;
