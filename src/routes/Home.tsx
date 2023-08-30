import { useEffect, useMemo, useState } from "react";

import { Flex, Spinner, Text, useMediaQuery } from "@chakra-ui/react";

import CategorySelect from "components/CategorySelect";
import Content from "components/Content";
import { customAxios } from "customAxios";
import changePageMetaTags from "utils/changePageMetaTags";

const Home = () => {
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
        changePageMetaTags();
        const asyncFunction = async () => {
            try {
                const { data: posts } =
                    await customAxios.get<global.PostWithChoiceCount[]>(
                        "/posts"
                    );
                const { data: categories } =
                    await customAxios.get<global.Category[]>("/categories");
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

    const filteredChoiceItems = useMemo(
        () =>
            choiceItems.filter((item) =>
                filterCategoryId ? item.categoryId === filterCategoryId : true
            ),
        [choiceItems, filterCategoryId]
    );

    return (
        <Flex pt={65} w={"full"} h={"full"} align={"center"} flexDir={"column"}>
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
                        <Flex
                            justify={"center"}
                            align={"center"}
                            w={"full"}
                            h={"full"}
                        >
                            <Spinner size={"lg"} />
                        </Flex>
                    ) : filteredChoiceItems.length !== 0 ? (
                        filteredChoiceItems.map((item) => (
                            <Content key={item.id} item={item} />
                        ))
                    ) : (
                        <Flex w={"full"} h={"full"}>
                            <Text fontSize={"3xl"} mt={8} ml={8}>
                                업로드된 고민거리가 없어요...
                            </Text>
                        </Flex>
                    )}
                </Flex>
            </Flex>
        </Flex>
    );
};

export default Home;
