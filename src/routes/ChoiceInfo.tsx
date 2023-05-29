import { MouseEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Modal from "../components/Modal";
import {
    AspectRatio,
    Box,
    Button,
    Card,
    Divider,
    Flex,
    Heading,
    Icon,
    Image,
    Spinner,
    Text,
    ToastId,
    useToast,
} from "@chakra-ui/react";
import { authorizedCustomAxios, customAxios } from "customAxios";
import { BsFillPersonFill } from "react-icons/bs";

export interface MatchParams {
    id: string;
}

interface ChoiceInfoProps {
    userObj: global.User | null;
    isLoggedIn: boolean;
}

const getRatio = (type1Users: number, type2Users: number, type: boolean) => {
    if (type1Users === type2Users) return 50;
    return Math.floor(
        ((type ? type2Users : type1Users) / (type1Users + type2Users)) * 100
    );
};

const ChoiceInfo = ({ userObj, isLoggedIn }: ChoiceInfoProps) => {
    const { id: idRef } = useParams();
    const navigate = useNavigate();
    const [init, setInit] = useState(false);
    const [item, setItem] = useState<global.Post | null>(null);
    const [choice1Users, setChoice1Users] = useState(0);
    const [choice2Users, setChoice2Users] = useState(0);
    const [selectedChoice, setSelectedChoice] =
        useState<global.ChoiceType>(null);
    // 불필요한 백엔드 작업 방지 위한 state
    const [selectedChoiceInDB, setSelectedChoiceInDB] =
        useState<global.ChoiceType>(null);
    const toast = useToast();
    const toastIdRef = useRef<ToastId>(0);
    const [clickedImg, setClickedImg] = useState("");
    const [activatedModal, setActivatedModal] = useState<
        "image" | "delete" | null
    >(null);
    const [isSelectFetching, setIsSelectFetching] = useState(true);

    useEffect(() => {
        const getPostInfo = async () => {
            try {
                const { data } =
                    await customAxios.get<global.PostWithChoiceCount | null>(
                        `/posts/${idRef}`
                    );
                if (data) {
                    setItem(data);
                    const choice1Count = data.choice1Count;
                    const choice2Count = data.choice2Count;
                    setChoice1Users(choice1Count);
                    setChoice2Users(choice2Count);
                } else {
                    navigate("/");
                }
                //   로그인 되어있으면
                if (isLoggedIn && userObj) {
                    const { data: prevChoice } =
                        await authorizedCustomAxios.get<global.Choice>(
                            `/posts/${idRef}/choice`
                        );
                    if (prevChoice) {
                        setSelectedChoice(prevChoice.choiceType);
                        setSelectedChoiceInDB(prevChoice.choiceType);
                    }
                }
            } catch (error) {
                console.log(error);
            } finally {
                setInit(true);
                setIsSelectFetching(false);
            }
        };
        getPostInfo();
    }, [idRef, isLoggedIn, navigate]);

    const choiceHandler = (selectedChoice: boolean) =>
        setSelectedChoice((prev) =>
            prev === selectedChoice ? null : selectedChoice
        );

    const completeSelect = async () => {
        // db랑 현재 선택한 거랑 같으면 return
        if (!checkChangeSelected()) return;
        //  db와 다른 선택인 경우만
        const prevChoiceInDB = selectedChoiceInDB;
        try {
            setIsSelectFetching(true);
            toastIdRef.current = toast({
                title: "진행 중...",
                status: "loading",
                position: "bottom-left",
            });
            // setAlertType("start");
            if (!toastIdRef.current) return;
            if (prevChoiceInDB === null) {
                // 선택을 새로 하려 할 때
                await authorizedCustomAxios.post(`/posts/${idRef}/choice`, {
                    choice: selectedChoice,
                });
                toast.update(toastIdRef.current, {
                    title: "선택 완료!",
                    status: "success",
                });
                // setAlertType("select");
                selectedChoice
                    ? setChoice2Users((prev) => prev + 1)
                    : setChoice1Users((prev) => prev + 1);
            } else if (selectedChoice === null) {
                // 선택 취소하려 할 때
                await authorizedCustomAxios.delete(`/posts/${idRef}/choice`);
                toast.update(toastIdRef.current, {
                    title: "취소 완료!",
                    status: "success",
                });
                // setAlertType("delete");
                prevChoiceInDB
                    ? setChoice2Users((prev) => prev - 1)
                    : setChoice1Users((prev) => prev - 1);
            } else {
                // 선택 변경하려 할 때
                await authorizedCustomAxios.post(`/posts/${idRef}/choice`, {
                    choice: selectedChoice,
                });
                toast.update(toastIdRef.current, {
                    title: "변경 완료!",
                    status: "success",
                });
                // setAlertType("change");
                setChoice1Users((prev) =>
                    selectedChoice ? prev - 1 : prev + 1
                );
                setChoice2Users((prev) =>
                    selectedChoice ? prev + 1 : prev - 1
                );
            }
            setSelectedChoiceInDB(selectedChoice);
        } catch (error) {
            toast.update(toastIdRef.current, {
                title: "예상치 못한 오류",
                status: "error",
            });
            setSelectedChoiceInDB(prevChoiceInDB);
        } finally {
            setIsSelectFetching(false);
        }
    };

    const checkChangeSelected = () => selectedChoice !== selectedChoiceInDB;

    const goToHome = () => {
        navigate("/");
    };

    const deletePost = async () => {
        try {
            await authorizedCustomAxios.delete(`/posts/${idRef}`);
            goToHome();
        } catch (error) {
            console.log(error);
        }
    };

    const toggleImgModal = (event: MouseEvent<HTMLImageElement>) => {
        const {
            currentTarget: { src },
        } = event;
        setActivatedModal("image");
        setClickedImg(src);
    };

    return (
        <>
            {init && item ? (
                <Flex
                    as={"article"}
                    flexDir={"column"}
                    w={"full"}
                    h={"full"}
                    align={"center"}
                    pt={"65px"}
                    pb={"40px"}
                    position={"relative"}
                    overflowY={"auto"}
                >
                    {/* <h2 className="ChoiceInfo-tip">
                        이미지를 자세히 보고 싶으면 클릭해보세요!
                    </h2> */}
                    <Flex
                        mt={8}
                        px={4}
                        mb={4}
                        w={"full"}
                        h={"30px"}
                        minH={"30px"}
                        justify={"flex-end"}
                        align={"center"}
                        fontSize={"sm"}
                    >
                        <Card
                            display={"flex"}
                            flexDir={"row"}
                            align={"center"}
                            h={"full"}
                            px={3}
                        >
                            {userObj && userObj.uid === item.uploaderId && (
                                <>
                                    <Button
                                        variant={"link"}
                                        colorScheme={"red"}
                                        size={"sm"}
                                        onClick={() =>
                                            setActivatedModal("delete")
                                        }
                                    >
                                        DELETE
                                    </Button>
                                    <Divider
                                        orientation="vertical"
                                        mx={3}
                                        borderColor={"gray.200"}
                                    />
                                </>
                            )}
                            <Icon as={BsFillPersonFill} mr={1} />
                            {choice1Users + choice2Users}
                        </Card>
                    </Flex>
                    <Heading
                        as="h3"
                        size={"lg"}
                        w={"80%"}
                        textAlign={"center"}
                        wordBreak={"break-word"}
                        mb={8}
                    >
                        Q. {item.title}
                    </Heading>
                    <Flex align={"center"} w={"80%"}>
                        {/* 서버에서 보내주는 item을 객체 형태로 보내주고 map 처리하자 */}
                        <Card
                            border={"2px"}
                            borderColor={"green.400"}
                            w={choice1Users > choice2Users ? "45%" : "40%"}
                            transition={"width 0.5s"}
                        >
                            <Heading
                                p={4}
                                as={"h4"}
                                size={"md"}
                                textAlign={"center"}
                                fontWeight={"semibold"}
                            >
                                {item.choice1}
                            </Heading>
                            {item.choice1Url && (
                                <AspectRatio ratio={1} cursor={"pointer"}>
                                    <Image
                                        src={item.choice1Url}
                                        onClick={toggleImgModal}
                                    />
                                </AspectRatio>
                            )}
                            {isLoggedIn && (
                                <Button
                                    borderTopRadius={0}
                                    isDisabled={isSelectFetching}
                                    onClick={() => choiceHandler(false)}
                                    isActive={selectedChoice === false}
                                >
                                    {isSelectFetching
                                        ? "로딩중.."
                                        : selectedChoice === false
                                        ? "선택됨"
                                        : "선택하기"}
                                </Button>
                            )}
                        </Card>
                        <Text flex={1} textAlign={"center"} fontSize={"3xl"}>
                            VS
                        </Text>
                        <Card
                            border={"2px"}
                            borderColor={"orange.400"}
                            w={choice2Users > choice1Users ? "45%" : "40%"}
                            transition={"width 0.5s"}
                        >
                            <Heading
                                p={4}
                                as={"h4"}
                                size={"md"}
                                textAlign={"center"}
                                fontWeight={"semibold"}
                            >
                                {item.choice2}
                            </Heading>
                            {item.choice2Url && (
                                <AspectRatio ratio={1} cursor={"pointer"}>
                                    <Image
                                        src={item.choice2Url}
                                        onClick={toggleImgModal}
                                    />
                                </AspectRatio>
                            )}
                            {isLoggedIn && (
                                <Button
                                    borderTopRadius={0}
                                    isDisabled={isSelectFetching}
                                    onClick={() => choiceHandler(true)}
                                    isActive={selectedChoice === true}
                                >
                                    {isSelectFetching
                                        ? "로딩중.."
                                        : selectedChoice
                                        ? "선택됨"
                                        : "선택하기"}
                                </Button>
                            )}
                        </Card>
                    </Flex>
                    <Flex w={"80%"} h={"20px"} mt={8} position={"relative"}>
                        {[false, true].map((choiceType) => (
                            <Box
                                key={String(choiceType)}
                                flex={getRatio(
                                    choice1Users,
                                    choice2Users,
                                    choiceType
                                )}
                                bgColor={
                                    !choiceType ? "green.400" : "orange.400"
                                }
                                borderLeftRadius={
                                    !choiceType
                                        ? 4
                                        : getRatio(
                                              choice1Users,
                                              choice2Users,
                                              choiceType
                                          ) === 100
                                        ? 4
                                        : 0
                                }
                                borderRightRadius={
                                    !choiceType
                                        ? getRatio(
                                              choice1Users,
                                              choice2Users,
                                              false
                                          ) === 100
                                            ? 4
                                            : 0
                                        : 4
                                }
                                transition={"flex 1s"}
                            >
                                <Text
                                    position={"absolute"}
                                    bottom={"-120%"}
                                    left={!choiceType ? 0 : undefined}
                                    right={!choiceType ? undefined : 0}
                                >
                                    {(choice1Users > 0 || choice2Users > 0) &&
                                        `${getRatio(
                                            choice1Users,
                                            choice2Users,
                                            choiceType
                                        )}%`}
                                </Text>
                            </Box>
                        ))}
                    </Flex>
                    <button
                        onClick={completeSelect}
                        className="ChoiceInfo-completeBtn"
                        style={{
                            visibility: !isSelectFetching
                                ? "visible"
                                : "hidden",
                        }}
                        id={checkChangeSelected() ? "selectedComplete" : ""}
                        disabled={!checkChangeSelected() || isSelectFetching}
                    >
                        {checkChangeSelected() ? "COMPLETE" : "DISABLED"}
                    </button>
                    {activatedModal === "delete" && (
                        <Modal
                            type="delete"
                            text="정말 이 질문을 삭제할까요?"
                            onDelete={deletePost}
                            onCloseModal={() => setActivatedModal(null)}
                        />
                    )}
                    {activatedModal === "image" && (
                        <Modal
                            type="img"
                            img={clickedImg}
                            onCloseModal={() => setActivatedModal(null)}
                        />
                    )}
                </Flex>
            ) : (
                <Spinner size={"xl"} />
            )}
        </>
    );
};

export default ChoiceInfo;
