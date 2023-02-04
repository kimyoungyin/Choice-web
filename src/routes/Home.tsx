import { ChangeEvent, useEffect, useState } from "react";
// import { v4 as uuidv4 } from "uuid";
import "../style.css";
import Content from "../components/Content";
import AddForm, { Category } from "../components/AddForm";
import Alert from "../components/Alert";
import customAixos from "../customAixos";
import { Item } from "routes/ChoiceInfo";

// interface HomeProps {
//     userObj: global.User;
// }

// const Home = ({ userObj }: HomeProps) => {
const Home = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [uploadMode, setUploadMode] = useState(false);
    const [choiceItems, setChoiceItems] = useState<Item[]>([]);
    const [isCurrentCategory, setIsCurrentCategory] = useState(true);
    const [categoryInput, setCategoryInput] = useState("");
    const [question, setQuestion] = useState("");
    const [choice1, setChoice1] = useState("");
    const [choice2, setChoice2] = useState("");
    const [attachment1, setAttachment1] = useState("");
    const [attachment2, setAttachment2] = useState("");
    const [isAlertOn, setIsAlertOn] = useState(false);
    const [isUploadCompleted, setIsUploadCompleted] = useState(false);
    const [filters, setFilters] = useState<Category[]>([]);
    const [filterCategoryId, setFilterCategoryId] = useState<number | null>(
        null
    );
    // const [value, setValue] = useState("");

    useEffect(() => {
        const asyncFunction = async () => {
            try {
                const { data: posts } = await customAixos.get("/posts");
                const { data: categories } = await customAixos.get(
                    "/categories"
                );
                setChoiceItems(posts);
                setFilters(categories);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };

        asyncFunction();

        return () => {
            setChoiceItems([]);
            setFilters([]);
        };
    }, []);

    const toggleUpload = () => {
        setUploadMode((prev) => !prev);
    };

    const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const {
            target: { files, className },
        } = event;
        if (!files) return;
        const theFile = Array.from(files)[0];
        const reader = new FileReader();
        try {
            reader.onloadend = () => {
                const result = reader.result as string; // 매우 긴 문자열
                if (className === "AddForm-choice1Img") {
                    setAttachment1(result);
                } else if (className === "AddForm-choice2Img") {
                    setAttachment2(result);
                }
            };
            reader.readAsDataURL(theFile);
        } catch {
            if (className === "AddForm-choice1Img") {
                setAttachment1("");
            } else if (className === "AddForm-choice2Img") {
                setAttachment2("");
            }
        }
    };

    const categoryRadio = (event: ChangeEvent<HTMLInputElement>) => {
        const {
            target: { value },
        } = event;
        setIsCurrentCategory(value === "current" ? true : false);
    };

    const handleInputChange = (
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const {
            target: { name, value },
        } = event;
        if (name === "newCategory") {
            setCategoryInput(value);
        } else if (name === "category") {
            setCategoryInput(value);
        } else if (name === "question") {
            setQuestion(value);
        } else if (name === "choice1") {
            setChoice1(value);
        } else if (name === "choice2") {
            setChoice2(value);
        }
    };

    const startSubmit = async () => {
        //     setUploadMode(false);
        setIsAlertOn(true);
        //     let attachment1Url = "";
        //     let attachment2Url = "";
        //     const attachmentRef1 = storageService
        //         .ref()
        //         .child(`${userObj.uid}/${uuidv4()}`);
        //     const attachmentRef2 = storageService
        //         .ref()
        //         .child(`${userObj.uid}/${uuidv4()}`);
        //     if (attachment1 !== "" && attachment2 !== "") {
        //         const response1 = await attachmentRef1.putString(
        //             attachment1,
        //             "data_url"
        //         );
        //         attachment1Url = await response1.ref.getDownloadURL();
        //         const response2 = await attachmentRef2.putString(
        //             attachment2,
        //             "data_url"
        //         );
        //         attachment2Url = await response2.ref.getDownloadURL();
        //     } else if (attachment1 !== "") {
        //         console.log("1만 빈칸 아님");
        //         const response1 = await attachmentRef1.putString(
        //             attachment1,
        //             "data_url"
        //         );
        //         attachment1Url = await response1.ref.getDownloadURL();
        //     } else if (attachment2 !== "") {
        //         console.log("2만 빈칸 아님");
        //         const response2 = await attachmentRef2.putString(
        //             attachment2,
        //             "data_url"
        //         );
        //         attachment2Url = await response2.ref.getDownloadURL();
        //     }

        //     const contentObj = {
        //         category: categoryInput,
        //         question: question,
        //         choice1: choice1,
        //         choice2: choice2,
        //         when: Date.now(),
        //         writer: userObj.displayName,
        //         photo: userObj.photo,
        //         attachment1Url,
        //         attachment2Url,
        //     };

        //     dbService
        //         .collection("questions")
        //         .add(contentObj)
        //         .then(() => setCompleteUpload(true));
        //     setCategoryInput("");
        //     setQuestion("");
        //     setChoice1("");
        //     setChoice2("");
        //     setAttachment1("");
        //     setAttachment2("");
        setIsUploadCompleted(true);
        if (isUploadCompleted) {
            setTimeout(() => setIsAlertOn(false), 2000);
        }
    };

    const onSubmit = async () => {
        // const onSubmit = async (e) => {
        // e.preventDefault();
        // const filterText = filters.map((filter) => filter.text);
        // if (categoryValue === "new" && filterText.includes(categoryInput)) {
        //     alert("이미 카테고리가 있습니다");
        // } else if (categoryValue === "new") {
        //     await dbService.collection("category").add({ text: categoryInput });
        // startSubmit();
        // } else if (categoryValue === "current") {
        startSubmit();
        // }
    };

    const cancelAdd = () => {
        setUploadMode(false);
        setCategoryInput("");
        setQuestion("");
        setChoice1("");
        setChoice2("");
        setAttachment1("");
        setAttachment2("");
    };

    const onChangeFilter = () => {
        // const onChangeFilter = (e) => {
        // const {
        //     target: { value },
        // } = e;
        // setValue(value);
    };

    const getFilter = (categoryId: number) => {
        if (filterCategoryId !== categoryId) {
            setFilterCategoryId(categoryId);
        } else if (filterCategoryId === categoryId) {
            setFilterCategoryId(null);
        }
    };

    return (
        <div className="Home">
            {!uploadMode ? (
                <>
                    <h2 className="Home-tip">
                        선택에 참여하여 고민하는 사람들을 도와주세요!
                    </h2>
                    <div className="Home-responsiveBox">
                        <nav className="Home-category">
                            {false && (
                                <>
                                    <label htmlFor="filter">
                                        카테고리 찾기
                                    </label>
                                    <input
                                        id="filter"
                                        type="text"
                                        // value={value}
                                        onChange={onChangeFilter}
                                    />
                                </>
                            )}
                            <div className="Home-categoryList">
                                {filters.map((filter) => (
                                    <button
                                        className={`Home-categoryBtn ${
                                            filter.id === filterCategoryId
                                                ? "active"
                                                : ""
                                        }`}
                                        key={filter.id}
                                        onClick={() => getFilter(filter.id)}
                                    >
                                        {filter.name}
                                    </button>
                                ))}
                            </div>
                        </nav>
                        <div className="Home-list">
                            {isLoading ? (
                                <div className="Home-loading">
                                    <div className="loader"></div>
                                </div>
                            ) : choiceItems.length !== 0 ? (
                                choiceItems.map((item) => {
                                    if (!filterCategoryId) {
                                        return (
                                            <Content
                                                key={item.id}
                                                item={item}
                                            />
                                        );
                                    } else {
                                        return (
                                            item.categoryId ===
                                                filterCategoryId && (
                                                <Content
                                                    key={item.id}
                                                    item={item}
                                                />
                                            )
                                        );
                                    }
                                })
                            ) : (
                                <div className="Home-noList">
                                    <span>업로드된 고민거리가 없어요...</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <button className="Home-button" onClick={toggleUpload}>
                        +
                    </button>
                </>
            ) : (
                <AddForm
                    onInputChange={handleInputChange}
                    onSubmit={onSubmit}
                    isCurrentCategory={isCurrentCategory}
                    categoryRadio={categoryRadio}
                    categoryInput={categoryInput}
                    question={question}
                    choice1={choice1}
                    choice2={choice2}
                    cancelAdd={cancelAdd}
                    onFileChange={onFileChange}
                    attachment1={attachment1}
                    attachment2={attachment2}
                    onClearAttachment1={() => setAttachment1("")}
                    onClearAttachment2={() => setAttachment2("")}
                    filters={filters}
                />
            )}
            {isAlertOn && (
                <Alert
                    text={isUploadCompleted ? "업로드 완료" : "업로드 중.."}
                    idText={isUploadCompleted ? "uploaded" : undefined}
                />
            )}
        </div>
    );
};

export default Home;
