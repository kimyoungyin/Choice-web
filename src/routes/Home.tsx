import { useEffect, useState } from "react";
// import { v4 as uuidv4 } from "uuid";
import Content from "../components/Content";
// import Alert from "../components/Alert";
import customAixos from "../customAixos";
import { Item } from "routes/ChoiceInfo";
import { Link } from "react-router-dom";

// interface HomeProps {
//     userObj: global.User;
// }

// const Home = ({ userObj }: HomeProps) => {
const Home = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [choiceItems, setChoiceItems] = useState<Item[]>([]);
    const [filters, setFilters] = useState<global.Category[]>([]);
    const [filterCategoryId, setFilterCategoryId] = useState<number | null>(
        null
    );

    useEffect(() => {
        const asyncFunction = async () => {
            try {
                const { data: posts } = await customAixos.get("/posts");
                const { data: categories } = await customAixos.get<
                    global.Category[]
                >("/categories");
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

    const getFilter = (categoryId: number) => {
        if (filterCategoryId !== categoryId) {
            setFilterCategoryId(categoryId);
        } else if (filterCategoryId === categoryId) {
            setFilterCategoryId(null);
        }
    };

    return (
        <div className="Home">
            <h2 className="Home-tip">
                선택에 참여하여 고민하는 사람들을 도와주세요!
            </h2>
            <div className="Home-responsiveBox">
                <nav className="Home-category">
                    {/* {false && (
                                <>
                                    <label htmlFor="filter">
                                        카테고리 찾기
                                    </label>
                                    <input
                                        id="filter"
                                        type="text"
                                        value={value}
                                        onChange={onChangeFilter}
                                    />
                                </>
                            )} */}
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
                                return <Content key={item.id} item={item} />;
                            } else {
                                return (
                                    item.categoryId === filterCategoryId && (
                                        <Content key={item.id} item={item} />
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
            <button className="Home-button">
                <Link to="/upload">+</Link>
            </button>
            {/* {isAlertOn && (
                <Alert
                    text={isUploadCompleted ? "업로드 완료" : "업로드 중.."}
                    idText={isUploadCompleted ? "uploaded" : undefined}
                />
            )} */}
        </div>
    );
};
// 이후에 전역으로 업로드 완료 알림
export default Home;
