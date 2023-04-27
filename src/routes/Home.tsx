import { useEffect, useState } from "react";
import Content from "../components/Content";
import customAixos from "../customAixos";
import { Link } from "react-router-dom";
import { Grid, Spinner } from "@chakra-ui/react";
import useThreeMediaQuery from "hooks/useThreeMediaQuery";

interface HomeProps {
    isLoggedIn: boolean;
}

const Home = ({ isLoggedIn }: HomeProps) => {
    const mediaQueryObj = useThreeMediaQuery();
    const [isLoading, setIsLoading] = useState(true);
    const [choiceItems, setChoiceItems] = useState<global.Post[]>([]);
    const [filters, setFilters] = useState<global.Category[]>([]);
    const [filterCategoryId, setFilterCategoryId] = useState<number | null>(
        null
    );

    useEffect(() => {
        const asyncFunction = async () => {
            try {
                const { data: posts } = await customAixos.get<global.Post[]>(
                    "/posts"
                );
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
        <div className="Home" id={!isLoggedIn ? "withoutNav" : ""}>
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
                <Grid
                    as="section"
                    templateColumns={`repeat(${
                        !mediaQueryObj.isLargerThan768
                            ? 1
                            : !mediaQueryObj.isLargerThan1024
                            ? 2
                            : !mediaQueryObj.isLargerThan1440
                            ? 3
                            : 4
                    }, 1fr)`}
                    bg={"gray.200"}
                    w={"100%"}
                    h={"100%"}
                    overflow={"auto"}
                    gap={16}
                    p={8}
                >
                    {isLoading ? (
                        <div className="Home-loading">
                            <Spinner size={"lg"} />
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
                </Grid>
            </div>
            {isLoggedIn && (
                <button className="Home-button">
                    <Link to="/upload">+</Link>
                </button>
            )}
        </div>
    );
};

export default Home;
