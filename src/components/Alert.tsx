interface AlertProps {
    text: string;
    idText: "start" | "complete";
}

const Alert = ({ text, idText }: AlertProps) => {
    return (
        <div className="Alert" id={idText}>
            {text}
        </div>
    );
};

export default Alert;
