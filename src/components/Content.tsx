import { EditIcon, RepeatIcon, TimeIcon } from "@chakra-ui/icons";
import {
    Box,
    Card,
    Flex,
    Heading,
    Icon,
    Spacer,
    Tag,
    Text,
} from "@chakra-ui/react";
import useMediaQueryWidth from "hooks/useMediaQueryWidth";
import { useTerm } from "hooks/useTerm";
import { useNavigate } from "react-router-dom";
interface ContentProps {
    item: global.PostWithChoiceCount;
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
    const updatedTerm = useTerm(Date.parse(item.updatedAt));
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

    const TermLayoutToRender = () => (
        <Flex
            align={"center"}
            p={2}
            bg={"gray.700"}
            borderBottomRadius={"lg"}
            color={"white"}
            fontSize={"xs"}
            fontWeight={"bold"}
        >
            <Icon as={EditIcon} marginRight={1} />
            {item.choice1Count + item.choice2Count}명
            <Spacer />
            {term === updatedTerm ? (
                <>
                    <Icon as={TimeIcon} marginRight={1} />
                    <Text
                        borderBottomRadius={"lg"}
                        textAlign={"end"}
                        lineHeight={1}
                    >
                        {term}
                    </Text>
                </>
            ) : (
                <Flex
                    bg={"pink.500"}
                    p={1}
                    px={2}
                    borderRadius={4}
                    align={"center"}
                    // color={"red.200"}
                >
                    <Icon as={RepeatIcon} marginRight={1} />
                    <Text
                        borderBottomRadius={"lg"}
                        textAlign={"end"}
                        lineHeight={1}
                    >
                        {updatedTerm}
                    </Text>
                </Flex>
            )}
        </Flex>
    );

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
                    <TermLayoutToRender />
                </Flex>
            </Card>
        </Box>
    );
};

export default Content;
