import { Fragment, MouseEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { ExternalLinkIcon } from "@chakra-ui/icons";
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
    Stat,
    StatHelpText,
    StatNumber,
    Text,
    ToastId,
    useColorModeValue,
    useToast,
} from "@chakra-ui/react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { BsFillPersonFill } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";

import DeleteWarningModal from "components/DeleteWarningModal";
import FullImageModal from "components/FullImageModal";
import { authorizedCustomAxios, customAxios } from "customAxios";
import useGoogleLogin from "hooks/useGoogleLogin";
import changePageMetaTags from "utils/changePageMetaTags";

export interface MatchParams {
    id: string;
}

interface ChoiceInfoProps {
    userObj: global.User | null;
    isLoggedIn: boolean;
    onLogin: () => void;
}

const getRatio = (type1Users: number, type2Users: number, type: boolean) => {
    if (type1Users === type2Users) return 50;
    return Math.floor(
        ((type ? type2Users : type1Users) / (type1Users + type2Users)) * 100
    );
};

const CHOICE_1 = false;
const CHOICE_2 = true;

const getColor = (choiceType: boolean) =>
    choiceType === CHOICE_1 ? "green.400" : "orange.400";

const ChoiceInfo = ({ userObj, isLoggedIn, onLogin }: ChoiceInfoProps) => {
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
    const textColor = useColorModeValue("black", "gray.300");
    const googleButtonColor = useColorModeValue("white", "black");
    const startGoogleLogin = useGoogleLogin(onLogin);

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

    useEffect(() => {
        changePageMetaTags(
            item?.title,
            `${item?.choice1} vs ${item?.choice2}: 당신의 선택은?`,
            item?.choice1Url || item?.choice2Url || undefined
        );
    }, [
        item?.title,
        item?.choice1,
        item?.choice2,
        item?.choice1Url,
        item?.choice2Url,
    ]);

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

    const isShareSupported = () => navigator.share ?? false;

    const share = async () => {
        const data: ShareData = {
            url: window.location.href,
            title: item?.title,
            text: `${item?.choice1} vs ${item?.choice2}: 당신의 선택은?`,
        };
        try {
            if (isShareSupported()) {
                await navigator.share(data);
                return;
            }
            if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href).then(() => {
                    toast({
                        title: "링크가 클립보드에 복사되었습니다.",
                        status: "success",
                        position: "bottom",
                    });
                });
                return;
            }
            toast({
                title: "공유하기가 지원되지 않는 환경입니다.",
                status: "error",
                position: "bottom",
            });
            return;
        } catch (error) {
            return toast({
                title: "알 수 없는 에러가 발생했습니다.",
                status: "error",
                position: "bottom",
            });
        }
    };

    const itemObjArr = [
        {
            choice: item?.choice1,
            isSelectedMore: choice1Users > choice2Users,
            choiceUrl: item?.choice1Url,
            choiceType: CHOICE_1,
        },
        {
            choice: item?.choice2,
            isSelectedMore: choice2Users > choice1Users,
            choiceUrl: item?.choice2Url,
            choiceType: CHOICE_2,
        },
    ];

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
                    color={textColor}
                >
                    <Flex
                        mt={8}
                        px={4}
                        mb={4}
                        w={"full"}
                        h={"30px"}
                        minH={"30px"}
                        justify={"space-between"}
                        align={"center"}
                        fontSize={"sm"}
                    >
                        <Button
                            variant={"unstyled"}
                            leftIcon={<AiOutlineArrowLeft />}
                            fontSize={"lg"}
                            display={"flex"}
                            alignItems={"center"}
                            onClick={() => navigate(-1)}
                        >
                            이전 페이지
                        </Button>
                        <Card
                            display={"flex"}
                            flexDir={"row"}
                            align={"center"}
                            h={"full"}
                            px={3}
                        >
                            {isLoggedIn &&
                                userObj &&
                                userObj.uid === item.uploaderId && (
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
                                            borderColor={"gray.200"}
                                            mx={3}
                                        />
                                    </>
                                )}
                            <Button
                                leftIcon={<ExternalLinkIcon />}
                                variant={"ghost"}
                                size={"small"}
                                colorScheme="blue"
                                onClick={share}
                            >
                                공유하기
                            </Button>
                            <Divider
                                orientation="vertical"
                                borderColor={"gray.200"}
                                mx={3}
                            />
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
                    <Flex align={"center"} w={"80%"} maxW={1024}>
                        {itemObjArr.map((itemObj, index) => (
                            <Fragment key={itemObj.choice}>
                                <Card
                                    key={itemObj.choice}
                                    border={"2px"}
                                    borderColor={getColor(itemObj.choiceType)}
                                    w={"40%"}
                                    maxW={"30vh"}
                                    transform={
                                        itemObj.isSelectedMore
                                            ? "scale(1.1)"
                                            : undefined
                                    }
                                    transition={"all 0.5s"}
                                >
                                    <Heading
                                        p={4}
                                        as={"h4"}
                                        size={"md"}
                                        textAlign={"center"}
                                        fontWeight={"semibold"}
                                        color={textColor}
                                    >
                                        {itemObj.choice}
                                    </Heading>
                                    {itemObj.choiceUrl && (
                                        <AspectRatio
                                            ratio={1}
                                            cursor={"pointer"}
                                        >
                                            <Image
                                                src={itemObj.choiceUrl}
                                                onClick={toggleImgModal}
                                            />
                                        </AspectRatio>
                                    )}
                                    {isLoggedIn && (
                                        <Button
                                            borderTopRadius={0}
                                            isDisabled={isSelectFetching}
                                            onClick={() =>
                                                choiceHandler(
                                                    itemObj.choiceType
                                                )
                                            }
                                            isActive={
                                                selectedChoice ===
                                                itemObj.choiceType
                                            }
                                        >
                                            {isSelectFetching
                                                ? "로딩중.."
                                                : selectedChoice ===
                                                  itemObj.choiceType
                                                ? "선택됨"
                                                : "선택하기"}
                                        </Button>
                                    )}
                                </Card>
                                {index === 0 && (
                                    <Text
                                        flex={1}
                                        textAlign={"center"}
                                        fontSize={"3xl"}
                                    >
                                        VS
                                    </Text>
                                )}
                            </Fragment>
                        ))}
                    </Flex>
                    <Flex
                        w={"80%"}
                        h={"20px"}
                        minH={"20px"}
                        mt={8}
                        position={"relative"}
                    >
                        {[CHOICE_1, CHOICE_2].map((choiceType) => (
                            <Box
                                key={String(choiceType)}
                                flex={getRatio(
                                    choice1Users,
                                    choice2Users,
                                    choiceType
                                )}
                                bgColor={getColor(choiceType)}
                                borderLeftRadius={
                                    choiceType === CHOICE_1
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
                                    choiceType === CHOICE_1
                                        ? getRatio(
                                              choice1Users,
                                              choice2Users,
                                              choiceType
                                          ) === 100
                                            ? 4
                                            : 0
                                        : 4
                                }
                                transition={"flex 1s"}
                            >
                                <Stat
                                    position={"absolute"}
                                    bottom={"-300%"}
                                    left={
                                        choiceType === CHOICE_1 ? 0 : undefined
                                    }
                                    right={
                                        choiceType === CHOICE_1 ? undefined : 0
                                    }
                                >
                                    <StatNumber fontSize={"xl"}>
                                        {(choice1Users > 0 ||
                                            choice2Users > 0) &&
                                            `${getRatio(
                                                choice1Users,
                                                choice2Users,
                                                choiceType
                                            )}%`}
                                    </StatNumber>
                                    <StatHelpText
                                        textAlign={
                                            choiceType === CHOICE_1
                                                ? "start"
                                                : "end"
                                        }
                                    >
                                        {choiceType === CHOICE_1
                                            ? choice1Users
                                            : choice2Users}
                                        명
                                    </StatHelpText>
                                </Stat>
                            </Box>
                        ))}
                    </Flex>
                    {isLoggedIn ? (
                        <Button
                            mt={16}
                            size={"lg"}
                            boxShadow={"md"}
                            onClick={completeSelect}
                            visibility={
                                !isSelectFetching ? "visible" : "hidden"
                            }
                            isDisabled={
                                !checkChangeSelected() || isSelectFetching
                            }
                        >
                            {checkChangeSelected() ? "COMPLETE" : "DISABLED"}
                        </Button>
                    ) : (
                        <Button
                            mt={16}
                            w={"80%"}
                            maxW={1024}
                            size={"lg"}
                            boxShadow={"md"}
                            leftIcon={<FcGoogle />}
                            bg={googleButtonColor}
                            whiteSpace={"normal"}
                            wordBreak={"break-word"}
                            onClick={startGoogleLogin}
                            // 구글 로그인 연결
                        >
                            로그인하고 선택에 참여해보세요!
                        </Button>
                    )}
                    <FullImageModal
                        isOpen={activatedModal === "image"}
                        onClose={() => setActivatedModal(null)}
                        src={clickedImg}
                    />

                    <DeleteWarningModal
                        isOpen={activatedModal === "delete"}
                        onClose={() => setActivatedModal(null)}
                        onDelete={deletePost}
                        onFulfilled={goToHome}
                        title={item.title}
                    />
                </Flex>
            ) : (
                <Spinner size={"xl"} />
            )}
        </>
    );
};

export default ChoiceInfo;
