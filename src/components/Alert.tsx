interface AlertProps {
    text: string;
    idText?: string;
}

const Alert = ({ text, idText }: AlertProps) => {
    return (
        <div className="Alert" id={idText}>
            {text}
        </div>
    );
};

export default Alert;
