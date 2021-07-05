import React from "react";
import "../style.css";

const Modal = ({ type, text, img, deleteContent }) => {
  return (
    <div className="Modal" onClick={deleteContent}>
      <div className="Modal-content">
        {type === "delete" ? (
          <>
            <div className="Modal-text">{text}</div>
            <div className="Modal-btns">
              <button className="Modal-noBtn">아니오</button>
              <button className="Modal-yesBtn">네</button>
            </div>
          </>
        ) : (
          <>
            <img className="Modal-img" src={img} alt="이미지 없음" />
          </>
        )}
      </div>
    </div>
  );
};

export default Modal;
