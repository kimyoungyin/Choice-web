import React from "react";
import "../style.css";

const AddForm = ({
    onChange,
    onSubmit,
    cancelAdd,
    categoryInput,
    question,
    choice1,
    choice2,
    onFileChange,
    attachment1,
    attachment2,
    onClearAttachment1,
    onClearAttachment2,
    filters,
}) => {
    return (
        <form className="AddForm" onSubmit={onSubmit}>
            <h2>질문 업로드</h2>
            <div className="AddForm-Box">
                <h3>1. 카테고리(선택)</h3>
                <select
                    id="category"
                    name="category"
                    value={categoryInput}
                    onChange={onChange}
                >
                    <option key="all" value="">
                        선택안함
                    </option>
                    {filters.map((filter) => (
                        <option key={filter.id} value={filter.text}>
                            {filter.text}
                        </option>
                    ))}
                </select>
            </div>
            <div className="AddForm-Box">
                <h3>2. 제목(필수)</h3>
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
                <h3>3. 선택 1 : 이미지(선택) / 글(필수)</h3>
                <label htmlFor="AddForm-choice1">IMAGE</label>
                <input
                    id="AddForm-choice1"
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
                            CLEAR IMAGE
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
                <h3>4. 선택 2 : 이미지(선택) / 글(필수)</h3>
                <label htmlFor="AddForm-choice2">IMAGE</label>
                <input
                    id="AddForm-choice2"
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
                            CLEAR IMAGE
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

            <div className="AddForm-btns">
                <button
                    onClick={cancelAdd}
                    type="button"
                    className="AddForm-cancelButton"
                >
                    CANCEL
                </button>
                <button type="submit" className="AddForm-button">
                    UPLOAD
                </button>
            </div>
        </form>
    );
};

export default AddForm;
