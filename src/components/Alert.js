import React from "react";
import "../style.css";

const Alert = ({ text, idText }) => {
    return (
        <div className="Alert" id={idText}>
            {text}
        </div>
    );
};

export default Alert;
