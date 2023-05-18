import { useEffect, useState } from "react";
import Content from "../components/Content";
import { Link } from "react-router-dom";
import { Flex, Spinner, useMediaQuery } from "@chakra-ui/react";
import { customAxios } from "customAxios";
import CategorySelect from "components/CategorySelect";

interface HomeProps {
    isLoggedIn: boolean;
}

const Home = ({ isLoggedIn }: HomeProps) => {
    const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
    const [isLoading, setIsLoading] = useState(true);
    const [choiceItems, setChoiceItems] = useState<
        global.PostWithChoiceCount[]
    >([]);
    const [filters, setFilters] = useState<global.Category[]>([]);
    const [filterCategoryId, setFilterCategoryId] = useState<number | null>(
        null
    );

    useEffect(() => {
        const asyncFunction = async () => {
            try {
                const { data: posts } = await customAxios.get<
                    global.PostWithChoiceCount[]
                >("/posts");
                const { data: categories } = await customAxios.get<
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

    return (
        <Flex
            // className="Home"
            pt={65}
            pb={8}
            w={"full"}
            h={"full"}
            align={"center"}
            flexDir={"column"}
        >
            {/* <h2 className="Home-tip">
                선택에 참여하여 고민하는 사람들을 도와주세요!
            </h2> */}
            <Flex
                flexDir={isLargerThan768 ? "row" : "column"}
                align={"center"}
                overflow={"auto"}
                w={"full"}
                h={"full"}
            >
                <Flex
                    as={"nav"}
                    w={isLargerThan768 ? "20%" : "full"}
                    h={isLargerThan768 ? "100%" : 50}
                    p={4}
                    mt={isLargerThan768 ? 0 : 2}
                    minW={200}
                    flexDir={isLargerThan768 ? "column" : "row"}
                    align={"center"}
                    gap={6}
                    whiteSpace={"nowrap"}
                    overflow={"auto"}
                >
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
                    <CategorySelect
                        categories={filters}
                        selectedId={filterCategoryId}
                        onChange={setFilterCategoryId}
                    />
                </Flex>
                <Flex
                    as="section"
                    w={"100%"}
                    h={"100%"}
                    overflow={"auto"}
                    wrap={"wrap"}
                    alignContent={"flex-start"}
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
                </Flex>
            </Flex>
            {isLoggedIn && (
                <button className="Home-button">
                    <Link to="/upload">+</Link>
                </button>
            )}
        </Flex>
    );
};

export default Home;
