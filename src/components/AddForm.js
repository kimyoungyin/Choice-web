import React from "react";
import "../style.css";

const AddForm = ({
    onChange,
    onSubmit,
    cancelAdd,
    question,
    choice1,
    choice2,
    onFileChange,
    attachment1,
    attachment2,
    onClearAttachment1,
    onClearAttachment2,
}) => {
    return (
        <form className="AddForm" onSubmit={onSubmit}>
            <div className="AddForm-Box">
                <label htmlFor="AddForm-question">질문</label>
                <input
                    className="AddForm-question"
                    id="AddForm-question"
                    type="text"
                    value={question}
                    name="question"
                    onChange={onChange}
                    required
                    autoComplete="off"
                />
            </div>
            <div className="AddForm-Box">
                <label htmlFor="AddForm-choice1">선택 1</label>
                <input
                    className="AddForm-choice1Img"
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                />
                {attachment1 && (
                    <div className="AddForm-imgData">
                        <img
                            className="AddForm-img"
                            src={attachment1}
                            alt="choice1Img"
                        />
                        <button onClick={onClearAttachment1}>
                            Clear image
                        </button>
                    </div>
                )}
                <input
                    className="AddForm-choice1"
                    id="AddForm-choice1"
                    type="text"
                    value={choice1}
                    name="choice1"
                    onChange={onChange}
                    required
                    autoComplete="off"
                />
            </div>
            <div className="AddForm-Box">
                <label htmlFor="AddForm-choice2">선택 2</label>
                <input
                    className="AddForm-choice2Img"
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                />
                {attachment2 && (
                    <div className="AddForm-imgData">
                        <img
                            className="AddForm-img"
                            src={attachment2}
                            alt="choice2Img"
                        />
                        <button onClick={onClearAttachment2}>
                            Clear image
                        </button>
                    </div>
                )}
                <input
                    className="AddForm-choice2 "
                    id="AddForm-choice2"
                    type="text"
                    value={choice2}
                    name="choice2"
                    onChange={onChange}
                    required
                    autoComplete="off"
                />
            </div>

            <button type="submit" className="AddForm-button">
                Upload
            </button>
            <button
                onClick={cancelAdd}
                type="button"
                className="AddForm-cancelButton"
            >
                Cancel
            </button>
        </form>
    );
};

export default AddForm;
