import React from "react";
import "../CSS/AddForm.css";

const AddForm = ({
    onChange,
    onSubmit,
    cancelAdd,
    question,
    choice1,
    choice2,
}) => {
    return (
        <form className="AddForm-form" onSubmit={onSubmit}>
            <input
                className="AddForm-question"
                type="text"
                value={question}
                name="question"
                onChange={onChange}
                required
            />
            <div className="AddForm-choices">
                <input
                    className="AddForm-choice1"
                    type="text"
                    value={choice1}
                    name="choice1"
                    onChange={onChange}
                    required
                />
                <input
                    className="AddForm-choice2"
                    type="text"
                    value={choice2}
                    name="choice2"
                    onChange={onChange}
                    required
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
