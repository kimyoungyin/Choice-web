interface ModalProps {
    type: string;
    text?: string;
    img?: string;
    onDelete?: () => void;
    onCloseModal?: () => void;
}
const Modal = ({ type, text, img, onDelete, onCloseModal }: ModalProps) => {
    return type === "delete" ? (
        <div className="Modal">
            <div className="Modal-content">
                <div className="Modal-text">{text}</div>
                <div className="Modal-btns">
                    <button className="Modal-noBtn" onClick={onCloseModal}>
                        아니오
                    </button>
                    <button className="Modal-yesBtn" onClick={onDelete}>
                        네
                    </button>
                </div>
            </div>
        </div>
    ) : (
        <div className="Modal" onClick={onCloseModal}>
            <img className="Modal-img" src={img} alt="이미지 없음" />
        </div>
    );
};

export default Modal;
