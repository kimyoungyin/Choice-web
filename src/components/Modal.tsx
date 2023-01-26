import { MouseEvent } from "react";
import "../style.css";

interface ModalProps {
    type: string;
    text?: string;
    img?: string;
    deleteContent: (event: MouseEvent<HTMLDivElement>) => void;
}
const Modal = ({ type, text, img, deleteContent }: ModalProps) => {
    return (
        <div className="Modal" onClick={deleteContent}>
            {type === "delete" ? (
                <div className="Modal-content">
                    <div className="Modal-text">{text}</div>
                    <div className="Modal-btns">
                        <button className="Modal-noBtn">아니오</button>
                        <button className="Modal-yesBtn">네</button>
                    </div>
                </div>
            ) : (
                <img className="Modal-img" src={img} alt="이미지 없음" />
            )}
        </div>
    );
};

export default Modal;
