import { MouseEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Alert from "../components/Alert";
import Modal from "../components/Modal";
import customAixos from "../customAixos";
import { ItemSummary } from "components/Content";
import { Spinner } from "@chakra-ui/react";

export interface MatchParams {
    id: string;
}

interface ChoiceInfoProps {
    userObj: global.User | null;
    isLoggedIn: boolean;
}

type ChoiceType = boolean;

interface Choice {
    choiceType: ChoiceType;
}

export interface Item extends ItemSummary {
    choice1Url: string | null;
    choice2Url: string | null;
    uploaderId: string;
    updatedAt: string;
    categoryId: number;
    Choices: Choice[]; // 모델
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
    const [choice1Users, setChoice1Users] = useState(0);
    const [choice2Users, setChoice2Users] = useState(0);
    const [item, setItem] = useState<Item | null>(null);
    const [selectedChoice, setSelectedChoice] = useState<ChoiceType | null>(
        null
    );
    // 불필요한 백엔드 작업 방지 위한 state
    const [selectedChoiceInDB, setSelectedChoiceInDB] =
        useState<ChoiceType | null>(null);
    const [alertType, setAlertType] = useState<
        "start" | "delete" | "select" | "change" | null
    >(null);
    // const [modaling, setModaling] = useState(false);
    const [clickedImg, setClickedImg] = useState("");
    const [activatedModal, setActivatedModal] = useState<
        "image" | "delete" | null
    >(null);
    const [isSelectFetching, setIsSelectFetching] = useState(true);

    useEffect(() => {
        const getPostInfo = async () => {
            try {
                const { data: item } = await customAixos.get<Item | null>(
                    `/posts/${idRef}`
                );
                if (item) {
                    setItem(item);
                    setChoice1Users(
                        item.Choices.filter((choice) => !choice.choiceType)
                            .length
                    );
                    setChoice2Users(
                        item.Choices.filter((choice) => choice.choiceType)
                            .length
                    );
                } else {
                    navigate("/");
                }
                //   로그인 되어있으면
                if (isLoggedIn && userObj) {
                    const { data: prevChoice } =
                        await customAixos.get<Choice | null>(
                            `/posts/${idRef}/choice`
                        );
                    if (prevChoice) {
                        setSelectedChoice(prevChoice.choiceType);
                        setSelectedChoiceInDB(prevChoice.choiceType);
                    }
                }
                // // 이미지 비율을 위한 코드
                // const img = new Image();
                // img.src = item.choice1Url;
                // img.onload = () => {
                //     console.log(img.width, img.height);
                // };
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
            setAlertType("start");
            if (prevChoiceInDB === null) {
                // 선택을 새로 하려 할 때
                await customAixos.post(`/posts/${idRef}/choice`, {
                    choice: selectedChoice,
                });
                setAlertType("select");
                selectedChoice
                    ? setChoice2Users((prev) => prev + 1)
                    : setChoice1Users((prev) => prev + 1);
            } else if (selectedChoice === null) {
                // 선택 취소하려 할 때
                await customAixos.delete(`/posts/${idRef}/choice`);
                setAlertType("delete");
                prevChoiceInDB
                    ? setChoice2Users((prev) => prev - 1)
                    : setChoice1Users((prev) => prev - 1);
            } else {
                // 선택 변경하려 할 때
                await customAixos.post(`/posts/${idRef}/choice`, {
                    choice: selectedChoice,
                });
                setAlertType("change");
                setChoice1Users((prev) =>
                    selectedChoice ? prev - 1 : prev + 1
                );
                setChoice2Users((prev) =>
                    selectedChoice ? prev + 1 : prev - 1
                );
            }
            setSelectedChoiceInDB(selectedChoice);
            setTimeout(() => setAlertType(null), 2000);
        } catch (error) {
            console.log(error);
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
            await customAixos.delete(`/posts/${idRef}`);
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
                <article className="ChoiceInfo">
                    <h2 className="ChoiceInfo-tip">
                        이미지를 자세히 보고 싶으면 클릭해보세요!
                    </h2>
                    <div className="ChoiceInfo-totalUsers">
                        <span>{item.Choices.length}</span>명이 참여함
                    </div>
                    <h3 className="ChoiceInfo-question">Q. {item.title}</h3>
                    <div className="ChoiceInfo-choices">
                        <div className="ChoiceInfo-choice1">
                            {item.choice1Url && (
                                <img
                                    onClick={toggleImgModal}
                                    className="ChoiceInfo-img"
                                    src={item.choice1Url}
                                    alt="choice1"
                                />
                            )}
                            <div className="ChoiceInfo-text">
                                <div>{item.choice1}</div>
                            </div>
                            {isLoggedIn && (
                                <button
                                    className="ChoiceInfo-choiceBtn"
                                    id={
                                        selectedChoice === false
                                            ? "selected"
                                            : ""
                                    }
                                    onClick={() => choiceHandler(false)}
                                    disabled={isSelectFetching}
                                    style={
                                        isSelectFetching
                                            ? { opacity: 0.5 }
                                            : undefined
                                    }
                                >
                                    {isSelectFetching
                                        ? "로딩중.."
                                        : selectedChoice === false
                                        ? "선택됨"
                                        : "선택하기"}
                                </button>
                            )}
                        </div>
                        <div className="ChoiceInfo-choice2">
                            {item.choice2Url && (
                                <img
                                    onClick={toggleImgModal}
                                    className="ChoiceInfo-img"
                                    src={item.choice2Url}
                                    alt="choice2"
                                />
                            )}
                            <div className="ChoiceInfo-text">
                                <div>{item.choice2}</div>
                            </div>
                            {isLoggedIn && (
                                <button
                                    className="ChoiceInfo-choiceBtn"
                                    id={selectedChoice ? "selected" : ""}
                                    onClick={() => choiceHandler(true)}
                                    disabled={isSelectFetching}
                                    style={
                                        isSelectFetching
                                            ? { opacity: 0.5 }
                                            : undefined
                                    }
                                >
                                    {isSelectFetching
                                        ? "로딩중.."
                                        : selectedChoice
                                        ? "선택됨"
                                        : "선택하기"}
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="ChoiceInfo-result">
                        <div
                            className="ChoiceInfo-choice1Per"
                            style={{
                                flex: getRatio(
                                    choice1Users,
                                    choice2Users,
                                    false
                                ),
                            }}
                        >
                            {(choice1Users > 0 || choice2Users > 0) &&
                                `${getRatio(
                                    choice1Users,
                                    choice2Users,
                                    false
                                )}%`}
                        </div>
                        <div
                            className="ChoiceInfo-choice2Per"
                            style={{
                                flex: getRatio(
                                    choice1Users,
                                    choice2Users,
                                    true
                                ),
                            }}
                        >
                            {(choice1Users > 0 || choice2Users > 0) &&
                                `${getRatio(
                                    choice1Users,
                                    choice2Users,
                                    true
                                )}%`}
                        </div>
                    </div>
                    <button
                        onClick={completeSelect}
                        className="ChoiceInfo-completeBtn"
                        style={{
                            visibility: !alertType ? "visible" : "hidden",
                        }}
                        id={checkChangeSelected() ? "selectedComplete" : ""}
                        disabled={
                            !checkChangeSelected() ||
                            isSelectFetching ||
                            alertType !== null
                        }
                    >
                        {checkChangeSelected() ? "COMPLETE" : "DISABLED"}
                    </button>
                    <div className="ChoiceInfo-fixedBtns">
                        <button
                            className="ChoiceInfo-homeBtn"
                            onClick={goToHome}
                        >
                            HOME
                        </button>
                        {userObj && userObj.uid === item.uploaderId && (
                            <button
                                onClick={() => setActivatedModal("delete")}
                                className="ChoiceInfo-deleteBtn"
                            >
                                DELETE
                            </button>
                        )}
                    </div>
                    {alertType && (
                        <Alert
                            text={
                                alertType === "start"
                                    ? "진행 중..."
                                    : alertType === "select"
                                    ? "선택 완료!"
                                    : alertType === "change"
                                    ? "변경 완료!"
                                    : "취소 완료!"
                            }
                            idText={
                                alertType === "start" ? "start" : "complete"
                            }
                        />
                    )}
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
                </article>
            ) : (
                <Spinner size={"xl"} />
            )}
        </>
    );
};

export default ChoiceInfo;
