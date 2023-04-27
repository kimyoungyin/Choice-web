import { TimeIcon } from "@chakra-ui/icons";
import {
    AspectRatio,
    Box,
    Card,
    Center,
    Flex,
    Heading,
    Icon,
    Tag,
    Text,
} from "@chakra-ui/react";
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
                h="100%"
                onClick={goToChoiceInfo}
                cursor={"pointer"}
            >
                <Flex flexDir={"column"} h={"100%"}>
                    <Flex justify={"space-between"} align={"baseline"} p={4}>
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
                            <Box flex={1} key={choiceObj.color}>
                                <AspectRatio
                                    ratio={1}
                                    backgroundImage={`url(${choiceObj.src})`}
                                    backgroundPosition="center"
                                    backgroundRepeat="no-repeat"
                                >
                                    <Flex
                                        backdropFilter="auto"
                                        backdropBlur={"sm"}
                                    >
                                        <Center
                                            p={2}
                                            color={"white"}
                                            bg={choiceObj.color}
                                            w={"100%"}
                                            minH={"30%"}
                                        >
                                            <Text
                                                fontWeight={"bold"}
                                                wordBreak={"break-all"}
                                            >
                                                {choiceObj.text}
                                            </Text>
                                        </Center>
                                    </Flex>
                                </AspectRatio>
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
