import React from "react";
import "../style.css";

const Modal = ({ text, deleteContent }) => {
    return (
        <div className="Modal" onClick={deleteContent}>
            <div className="Modal-content">
                <div className="Modal-text">{text}</div>
                <div className="Modal-btns">
                    <button className="Modal-noBtn">아니오</button>
                    <button className="Modal-yesBtn">네</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
