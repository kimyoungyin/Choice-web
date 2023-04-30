import { TimeIcon } from "@chakra-ui/icons";
import { Box, Card, Flex, Heading, Icon, Tag, Text } from "@chakra-ui/react";
import useMediaQueryWidth from "hooks/useMediaQueryWidth";
import { useTerm } from "hooks/useTerm";
import { useNavigate } from "react-router-dom";
interface ContentProps {
    item: global.Post;
}

const Content = ({ item }: ContentProps) => {
    const mediaQueryWidth = useMediaQueryWidth(
        "100%",
        "50%",
        "33.3%",
        "25%",
        "20%"
    );
    const term = useTerm(Date.parse(item.createdAt));
    const navigate = useNavigate();
    // const toggleChoiceMode = () => {
    //     const homeList = document.querySelector(".Home-list");
    // };

    const goToChoiceInfo = () => {
        navigate(`/detail/${item.id}`);
    };

    const choiceArr = [
        { text: item.choice1, src: item.choice1Url, color: "orange.400" },
        { text: item.choice2, src: item.choice2Url, color: "green.400" },
    ];

    return (
        <Box w={mediaQueryWidth} p={4}>
            <Card
                as="article"
                shadow={"md"}
                borderRadius={"lg"}
                h={300}
                onClick={goToChoiceInfo}
                cursor={"pointer"}
            >
                <Flex flexDir={"column"} h={"100%"}>
                    <Flex
                        justify={"space-between"}
                        align={"baseline"}
                        p={4}
                        borderBottom={"2px"}
                        borderColor={"gray.200"}
                    >
                        <Heading
                            as="h3"
                            size={"md"}
                            wordBreak={"keep-all"}
                            flex={1}
                        >
                            {item.title}
                        </Heading>
                        {item.Category && (
                            <Tag size={"md"}>{item.Category.name}</Tag>
                        )}
                    </Flex>
                    <Flex flex={1} align={"center"}>
                        {choiceArr.map((choiceObj) => (
                            <Box
                                flex={1}
                                key={choiceObj.color}
                                backgroundImage={
                                    choiceObj.src
                                        ? `url(${choiceObj.src})`
                                        : undefined
                                }
                                backgroundPosition={
                                    choiceObj.src ? "center" : undefined
                                }
                                backgroundRepeat={
                                    choiceObj.src ? "no-repeat" : undefined
                                }
                                h={"100%"}
                            >
                                <Flex
                                    backdropFilter="auto"
                                    backdropBlur={"sm"}
                                    flexDir={"column"}
                                    justify={"center"}
                                    h="100%"
                                >
                                    <Text
                                        fontWeight={"bold"}
                                        textAlign={"center"}
                                        overflow={"hidden"}
                                        p={2}
                                        color={"white"}
                                        bg={choiceObj.color}
                                    >
                                        {choiceObj.text}
                                    </Text>
                                </Flex>
                            </Box>
                        ))}
                    </Flex>
                    <Flex
                        justify={"flex-end"}
                        align={"center"}
                        p={2}
                        bg={"gray.700"}
                        borderBottomRadius={"lg"}
                        color={"white"}
                        fontSize={"xs"}
                        fontWeight={"bold"}
                    >
                        <Text
                            borderBottomRadius={"lg"}
                            textAlign={"end"}
                            lineHeight={1}
                        >
                            {term}
                        </Text>
                        <Icon as={TimeIcon} marginLeft={2} />
                    </Flex>
                </Flex>
            </Card>
        </Box>
    );
};

export default Content;
