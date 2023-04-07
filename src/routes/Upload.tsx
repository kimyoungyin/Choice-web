import imageCompression from "browser-image-compression";
import customAixos from "customAixos";
import useInput from "hooks/useInput";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";

interface UploadProps {
    userObj: global.User;
    onStartUpload: () => void;
    onCompleteUpload: () => void;
}

interface ChoiceImage {
    file: File;
    previewUrl: string;
}

const SIZE_LIMIT_MB = 1;

const Upload = ({ userObj, onStartUpload, onCompleteUpload }: UploadProps) => {
    const history = useHistory();
    const [isCategoryFetching, setIsCategoryFetching] = useState(true);
    const [categoryType, setCategoryType] = useState<"current" | "new">(
        "current"
    );
    const [categories, setCategories] = useState<global.Category[]>([]);
    const titleInputProps = useInput("");
    const categorySelectProps = useInput("");
    const categoryInputProps = useInput("");
    const choice1InputProps = useInput("");
    const choice2InputProps = useInput("");
    const [choice1Image, setChoice1Image] = useState<ChoiceImage | null>(null);
    const [choice2Image, setChoice2Image] = useState<ChoiceImage | null>(null);
    const categorySelectRef = useRef<HTMLSelectElement>(null);
    const categoryInputRef = useRef<HTMLInputElement>(null);
    const titleRef = useRef<HTMLInputElement>(null);
    const choice1InputRef = useRef<HTMLInputElement>(null);
    const choice2InputRef = useRef<HTMLInputElement>(null);
    const choice1ImageInputRef = useRef<HTMLInputElement>(null);
    const choice2ImageInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const asyncFunction = async () => {
            try {
                const { data: categories } = await customAixos.get(
                    "/categories"
                );
                setCategories(categories);
                setIsCategoryFetching(false);
            } catch (error) {
                history.goBack();
            }
        };
        asyncFunction();
    }, [history]);

    const handleCategoryRadioChange = () =>
        setCategoryType((prev) => (prev === "current" ? "new" : "current"));

    const clearImageInput = (number: 1 | 2) => {
        if (number === 1 && choice1ImageInputRef.current) {
            choice1ImageInputRef.current.value = "";
            setChoice1Image(null);
        } else if (number === 2 && choice2ImageInputRef.current) {
            choice2ImageInputRef.current.value = "";
            setChoice2Image(null);
        }
    };
    // 업로드 중과 업로드 후 리다이렉트 구현 필요
    const handleFileCHange = async (
        event: ChangeEvent<HTMLInputElement>,
        setState: (newValue: ChoiceImage | null) => void
    ) => {
        const {
            target: { files },
        } = event;
        if (!files) return;
        const file = Array.from(files)[0];
        try {
            const options = {
                maxSizeMB: SIZE_LIMIT_MB,
            };
            const compressedFile = await imageCompression(file, options);
            const reader = new FileReader();
            reader.readAsDataURL(compressedFile);
            reader.onloadend = () => {
                const previewUrl = reader.result as string;
                setState({ file, previewUrl });
            };
        } catch {
            setState(null);
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const categoryName =
            categoryType === "current"
                ? categorySelectProps.value.trim()
                : categoryInputProps.value.trim();
        const title = titleInputProps.value.trim();
        const choice1 = choice1InputProps.value.trim();
        const choice2 = choice2InputProps.value.trim();
        if (categoryName === "") {
            alert("카테고리를 입력해주세요");
            categoryType === "current"
                ? categorySelectRef.current?.focus()
                : categoryInputRef.current?.focus();
            return;
        }
        if (
            categoryType === "new" &&
            categories.find((category) => category.name === categoryName)
        ) {
            alert("해당 카테고리는 이미 있습니다");
            categoryInputRef.current?.focus();
            return;
        }
        if (title === "") {
            alert("제목을 입력해주세요");
            titleRef.current?.focus();
            return;
        }
        if (choice1 === "") {
            alert("첫 번째 선택지를 입력해주세요");
            choice1InputRef.current?.focus();
            return;
        }
        if (choice2 === "") {
            alert("두 번째 선택지를 입력해주세요");
            choice2InputRef.current?.focus();
            return;
        }
        const formData = new FormData();
        formData.append("categoryName", categoryName);
        formData.append("title", title);
        formData.append("choice1", choice1);
        formData.append("choice2", choice2);
        choice1Image && formData.append("choice1Image", choice1Image.file);
        choice2Image && formData.append("choice2Image", choice2Image.file);
        formData.append("uploaderId", userObj.uid);
        try {
            onStartUpload();
            const {
                data: { postId },
            } = await customAixos.post<{ postId: number }>("/posts", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            onCompleteUpload();
            history.push(`/detail/${postId}`);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <form
                className="AddForm"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
            >
                <h2 className="Home-tip inAddForm">
                    새로운 카테고리를 만들고 싶다면 <span>새 카테고리</span>
                    란를 클릭하세요!
                </h2>
                <h2 className="Home-title">질문 업로드</h2>
                <div className="AddForm-Box">
                    <h3>1. 카테고리(선택)</h3>
                    <div
                        className="AddForm-categoryRadio"
                        onChange={handleCategoryRadioChange}
                    >
                        <label
                            className="AddForm-categoryLabel"
                            htmlFor="current"
                        >
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
                    {/* 카테고리 불러오기 */}
                    {!isCategoryFetching &&
                    categories.length > 0 &&
                    categoryType === "current" ? (
                        <select
                            ref={categorySelectRef}
                            id="category"
                            name="category"
                            {...categorySelectProps}
                        >
                            <option key="all" value="">
                                선택안함
                            </option>
                            {categories.map((filter) => (
                                <option key={filter.id} value={filter.name}>
                                    {filter.name}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            ref={categoryInputRef}
                            className="AddForm-newCategory"
                            type="text"
                            {...categoryInputProps}
                            name="newCategory"
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
                        ref={titleRef}
                        className="AddForm-question"
                        id="AddForm-question"
                        type="text"
                        {...titleInputProps}
                        name="question"
                        required
                        autoComplete="off"
                        placeholder="제목을 입력해주세요"
                    />
                </div>
                <div className="AddForm-Box">
                    <h3>3. 선택 1 : 이미지(선택) / 글(필수)</h3>
                    <label htmlFor="AddForm-choice1">IMAGE</label>
                    <input
                        ref={choice1ImageInputRef}
                        id="AddForm-choice1"
                        className="AddForm-choice1Img"
                        type="file"
                        onChange={(event) =>
                            handleFileCHange(event, (obj) =>
                                setChoice1Image(obj)
                            )
                        }
                        name="choice1Image"
                        accept="image/*"
                    />
                    {choice1Image?.previewUrl && (
                        <div className="AddForm-imgData">
                            <img
                                className="AddForm-img"
                                src={choice1Image.previewUrl}
                                alt="choice1Img"
                            />
                            <button
                                onClick={() => clearImageInput(1)}
                                type="reset"
                            >
                                CLEAR IMAGE
                            </button>
                        </div>
                    )}
                    <input
                        ref={choice1InputRef}
                        className="AddForm-choice1"
                        id="AddForm-choice1"
                        type="text"
                        {...choice1InputProps}
                        name="choice1"
                        required
                        autoComplete="off"
                        placeholder="고민되는 선택지 중 하나를 입력해주세요"
                    />
                </div>
                <div className="AddForm-Box">
                    <h3>4. 선택 2 : 이미지(선택) / 글(필수)</h3>
                    <label htmlFor="AddForm-choice2">IMAGE</label>
                    <input
                        ref={choice2ImageInputRef}
                        id="AddForm-choice2"
                        className="AddForm-choice2Img"
                        type="file"
                        onChange={(event) =>
                            handleFileCHange(event, (obj) =>
                                setChoice2Image(obj)
                            )
                        }
                        name="choice2Image"
                        accept="image/*"
                    />
                    {choice2Image?.previewUrl && (
                        <div className="AddForm-imgData">
                            <img
                                className="AddForm-img"
                                src={choice2Image.previewUrl}
                                alt="choice2Img"
                            />
                            <button
                                onClick={() => clearImageInput(2)}
                                type="reset"
                            >
                                CLEAR IMAGE
                            </button>
                        </div>
                    )}
                    <input
                        ref={choice2InputRef}
                        className="AddForm-choice2"
                        id="AddForm-choice2"
                        type="text"
                        {...choice2InputProps}
                        name="choice2"
                        required
                        autoComplete="off"
                        placeholder="고민되는 선택지 중 다른 하나를 입력해주세요"
                    />
                </div>

                <div className="AddForm-btns">
                    <button
                        onClick={() => history.goBack()}
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
        </>
    );
};

export default Upload;
