import { useRef } from "react";
import { ChangeEvent } from "react";
import "../style.css";

export interface Category {
    id: number;
    name: string;
}

interface AddFormProps {
    onChange: () => void;
    onSubmit: () => void;
    categoryValue: string;
    categoryRadio: () => void;
    cancelAdd: () => void;
    categoryInput: string;
    question: string;
    choice1: string;
    choice2: string;
    onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
    attachment1: string;
    attachment2: string;
    onClearAttachment1: () => void;
    onClearAttachment2: () => void;
    filters: Category[];
}

const AddForm = ({
    onChange,
    onSubmit,
    categoryValue,
    categoryRadio,
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
}: AddFormProps) => {
    const choice1ImageRef = useRef<HTMLInputElement | null>(null);
    const choice2ImageRef = useRef<HTMLInputElement | null>(null);

    const resetImageInput = (type: 1 | 2) => {
        if (type === 1 && choice1ImageRef.current) {
            choice1ImageRef.current.value = "";
            onClearAttachment1();
        } else if (type === 2 && choice2ImageRef.current) {
            choice2ImageRef.current.value = "";
            onClearAttachment2();
        }
    };

    return (
        <form
            className="AddForm"
            onSubmit={onSubmit}
            encType="multipart/form-data"
        >
            <h2 className="Home-tip inAddForm">
                새로운 카테고리를 만들고 싶다면 <span>새 카테고리</span>
                란를 클릭하세요!
            </h2>
            <h2 className="Home-title">질문 업로드</h2>
            <div className="AddForm-Box">
                <h3>1. 카테고리(선택)</h3>
                <div className="AddForm-categoryRadio" onChange={categoryRadio}>
                    <label className="AddForm-categoryLabel" htmlFor="current">
                        <input
                            type="radio"
                            id="current"
                            name="setCategory"
                            value="current"
                            defaultChecked
                        />
                        기존 카테고리
                    </label>
                    <label className="AddForm-categoryLabel" htmlFor="new">
                        <input
                            type="radio"
                            id="new"
                            name="setCategory"
                            value="new"
                        />
                        새 카테고리
                    </label>
                </div>
                {categoryValue === "current" ? (
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
                            <option key={filter.id} value={filter.name}>
                                {filter.name}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        className="AddForm-newCategory"
                        type="text"
                        value={categoryInput}
                        name="newCategory"
                        onChange={onChange}
                        required
                        maxLength={10}
                        autoComplete="off"
                        placeholder="새 카테고리를 입력해주세요(최대 10자)"
                    />
                )}
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
                    placeholder="제목을 입력해주세요"
                />
            </div>
            <div className="AddForm-Box">
                <h3>3. 선택 1 : 이미지(선택) / 글(필수)</h3>
                <label htmlFor="AddForm-choice1">IMAGE</label>
                <input
                    ref={choice1ImageRef}
                    id="AddForm-choice1"
                    className="AddForm-choice1Img"
                    type="file"
                    name="choice1Image"
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
                        <button onClick={() => resetImageInput(1)}>
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
                    placeholder="고민되는 선택지 중 하나를 입력해주세요"
                />
            </div>
            <div className="AddForm-Box">
                <h3>4. 선택 2 : 이미지(선택) / 글(필수)</h3>
                <label htmlFor="AddForm-choice2">IMAGE</label>
                <input
                    ref={choice2ImageRef}
                    id="AddForm-choice2"
                    className="AddForm-choice2Img"
                    type="file"
                    name="choice2Image"
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
                        <button onClick={() => resetImageInput(2)}>
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
                    placeholder="고민되는 선택지 중 다른 하나를 입력해주세요"
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
