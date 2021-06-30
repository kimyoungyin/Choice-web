import React, { useEffect, useState } from "react";
import { dbService, storageService } from "../fb";
import "../style.css";
import { useHistory } from "react-router";
import Alert from "../components/Alert";
import Modal from "../components/Modal";

const ChoiceInfo = ({ match, userObj }) => {
    const history = useHistory();
    const [init, setInit] = useState(false);
    const [document, setDocument] = useState(null);
    const [choice1Users, setChoice1Users] = useState(0);
    const [choice2Users, setChoice2Users] = useState(0);
    const [item, setItem] = useState(null);
    const [selected1, setSelected1] = useState(false);
    const [selected2, setSelected2] = useState(false);
    const [already, setAlready] = useState(null);
    const [alreadyId, setAlreadyId] = useState(null);
    const [btn1Id, setBtn1Id] = useState("");
    const [btn2Id, setBtn2Id] = useState("");
    const [floatingAlert, setFloatingAlert] = useState(false);
    const [floatingDeleteAlert, setFloatingDeleteAlert] = useState(false);
    const [modaling, setModaling] = useState(false);
    const [clickedImg, setClickedImg] = useState("");
    const [imgModaling, setImgModaling] = useState(false);

    const checkSelected = async (choiceType, documentRef) => {
        await documentRef
            .collection(`choice${choiceType}Users`)
            .where("user", "==", userObj.displayName)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.data().user === userObj.displayName) {
                        if (choiceType === 1) {
                            setSelected1(true);
                            setBtn1Id("selected");
                            setAlready("selected1");
                            setAlreadyId(doc.id);
                        } else if (choiceType === 2) {
                            setSelected2(true);
                            setBtn2Id("selected");
                            setAlready("selected2");
                            setAlreadyId(doc.id);
                        }
                    }
                    setInit(true);
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    };

    const fetchData = async () => {
        const idRef = match.params.id;
        const documentRef = await dbService.collection("questions").doc(idRef);
        const itemRef = await documentRef.get().then((doc) => doc.data());
        const itemWithId = {
            ...itemRef,
            id: idRef,
        };
        await documentRef
            .get()
            .then(() => {
                documentRef
                    .collection("choice1Users")
                    .limit(1)
                    .get()
                    .then((sub) => {
                        setChoice1Users(sub.size);
                        if (sub.size !== 0) {
                            checkSelected(1, documentRef);
                        } else {
                            setInit(true);
                        }
                    });
                documentRef
                    .collection("choice2Users")
                    .limit(1)
                    .get()
                    .then((sub) => {
                        setChoice2Users(sub.size);
                        if (sub.size !== 0) {
                            checkSelected(2, documentRef);
                        } else {
                            setInit(true);
                        }
                    });
            })
            .catch(function (error) {
                console.log("Error getting document:", error);
            });
        setDocument(documentRef);
        setItem(itemWithId);
    };

    useEffect(() => {
        fetchData();

        return () => setDocument(null);
    }, [already]);

    const addChoice1User = () => {
        if (!selected1 && !selected2) {
            setChoice1Users(choice1Users + 1);
            setSelected1(true);
            setBtn1Id("selected");
        } else if (selected1 && !selected2) {
            setChoice1Users(choice1Users - 1);
            setSelected1(false);
            setBtn1Id("");
        } else if (!selected1 && selected2) {
            setChoice1Users(choice1Users + 1);
            setChoice2Users(choice2Users - 1);
            setSelected1(true);
            setSelected2(false);
            setBtn2Id("");
            setBtn1Id("selected");
        }
    };

    const addChoice2User = () => {
        if (!selected1 && !selected2) {
            setChoice2Users(choice2Users + 1);
            setSelected2(true);
            setBtn2Id("selected");
        } else if (selected2 && !selected1) {
            setChoice2Users(choice2Users - 1);
            setSelected2(false);
            setBtn2Id("");
        } else if (!selected2 && selected1) {
            setChoice2Users(choice2Users + 1);
            setChoice1Users(choice1Users - 1);
            setSelected2(true);
            setSelected1(false);
            setBtn1Id("");
            setBtn2Id("selected");
        }
    };

    const completeSelect = async () => {
        setFloatingAlert(true);
        if (already === null) {
            if (selected1) {
                await document
                    .collection("choice1Users")
                    .add({ user: userObj.displayName });
                setAlready("selected1");
            } else if (selected2) {
                await document
                    .collection("choice2Users")
                    .add({ user: userObj.displayName });
                setAlready("selected2");
            }
        } else if (already === "selected1") {
            if (selected2) {
                await document
                    .collection("choice2Users")
                    .add({ user: userObj.displayName });
                await document
                    .collection("choice1Users")
                    .doc(alreadyId)
                    .delete();
                setAlready("selected2");
            } else if (!selected1 && !selected2) {
                await document
                    .collection("choice1Users")
                    .doc(alreadyId)
                    .delete();
                setAlready(null);
            }
        } else if (already === "selected2") {
            if (selected1) {
                await document
                    .collection("choice1Users")
                    .add({ user: userObj.displayName });
                await document
                    .collection("choice2Users")
                    .doc(alreadyId)
                    .delete();
                setAlready("selected1");
            } else if (!selected1 && !selected2) {
                await document
                    .collection("choice2Users")
                    .doc(alreadyId)
                    .delete();
                setAlready(null);
            }
        }
        setTimeout(() => setFloatingAlert(false), 2000);
    };

    const checkChangeSelected = (already) => {
        if (selected1) {
            return already !== "selected1";
        } else if (selected2) {
            return already !== "selected2";
        } else {
            return already !== null;
        }
    };

    const goToHome = () => {
        history.push("/");
    };

    const toggleModal = () => {
        setModaling((prev) => !prev);
    };

    // const deleteContent = async () => {
    //     const ok = window.confirm("정말 이 질문을 삭제하겠습니까?");
    //     if (ok) {
    //         await document.delete();
    //         if (item.attachment1Url !== "") {
    //             await storageService.refFromURL(item.attachment1Url).delete();
    //         }
    //         if (item.attachment2Url !== "") {
    //             await storageService.refFromURL(item.attachment2Url).delete();
    //         }
    //         history.push("/");
    //     }
    // };

    const deleteContent = async (e) => {
        const {
            target: { className },
        } = e;
        if (className === "Modal-yesBtn") {
            setModaling(false);
            setFloatingDeleteAlert(true);
            await document.delete();
            if (item.attachment1Url !== "") {
                await storageService.refFromURL(item.attachment1Url).delete();
            }
            if (item.attachment2Url !== "") {
                await storageService.refFromURL(item.attachment2Url).delete();
            }
            setFloatingDeleteAlert(false);
            history.push("/");
        } else if (className === "Modal-noBtn" || className === "Modal") {
            setModaling(false);
        }
    };

    const toggleImgModal = (e) => {
        const {
            target: { src },
        } = e;
        setImgModaling((prev) => !prev);
        setClickedImg(src);
    };

    return (
        <>
            {init && (
                <article className="ChoiceInfo">
                    <h2 className="ChoiceInfo-tip">
                        이미지를 자세히 보고 싶으면 클릭해보세요!
                    </h2>
                    <h2 className="ChoiceInfo-writer">
                        {item.writer} 님의 고민!
                    </h2>
                    <h3 className="ChoiceInfo-question">Q. {item.question}</h3>
                    <div className="ChoiceInfo-choices">
                        <div className="ChoiceInfo-choice1">
                            {item.attachment1Url && (
                                <img
                                    onClick={toggleImgModal}
                                    className="ChoiceInfo-img"
                                    src={item.attachment1Url}
                                    alt="choice1"
                                />
                            )}
                            <div className="ChoiceInfo-text">
                                <div>{item.choice1}</div>
                            </div>
                            <button
                                className="ChoiceInfo-choiceBtn"
                                id={btn1Id}
                                onClick={addChoice1User}
                            >
                                {selected1 ? "선택됨" : "선택하기"}
                            </button>

                            <h4 className="ChoiceInfo-percentage">
                                {choice1Users === 0 && choice2Users === 0
                                    ? 0
                                    : Math.floor(
                                          (100 * choice1Users) /
                                              (choice1Users + choice2Users)
                                      )}
                                %<div>{choice1Users}명</div>
                            </h4>
                        </div>
                        <div className="ChoiceInfo-choice2">
                            {item.attachment2Url && (
                                <img
                                    onClick={toggleImgModal}
                                    className="ChoiceInfo-img"
                                    src={item.attachment2Url}
                                    alt="choice2"
                                />
                            )}
                            <div className="ChoiceInfo-text">
                                <div>{item.choice2}</div>
                            </div>
                            <button
                                className="ChoiceInfo-choiceBtn"
                                id={btn2Id}
                                onClick={addChoice2User}
                            >
                                {selected2 ? "선택됨" : "선택하기"}
                            </button>
                            {/* {selected1 || selected2 ? (
                                <h4 className="ChoiceInfo-percentage">
                                    {Math.floor(
                                        (100 * choice2Users) /
                                            (choice1Users + choice2Users)
                                    )}
                                    %
                                </h4>
                            ) : null} */}
                            <h4 className="ChoiceInfo-percentage">
                                {choice1Users === 0 && choice2Users === 0
                                    ? 0
                                    : Math.floor(
                                          (100 * choice2Users) /
                                              (choice1Users + choice2Users)
                                      )}
                                %<div>{choice2Users}명</div>
                            </h4>
                        </div>
                    </div>

                    {!floatingAlert && (
                        <button
                            onClick={completeSelect}
                            className="ChoiceInfo-completeBtn"
                            id={
                                checkChangeSelected(already)
                                    ? "selectedComplete"
                                    : ""
                            }
                            disabled={!checkChangeSelected(already)}
                        >
                            {checkChangeSelected(already)
                                ? "COMPLETE"
                                : "DISABLED"}
                        </button>
                    )}

                    <div className="ChoiceInfo-fixedBtns">
                        <button
                            className="ChoiceInfo-homeBtn"
                            onClick={goToHome}
                        >
                            HOME
                        </button>
                        {userObj.displayName === item.writer && (
                            <button
                                onClick={toggleModal}
                                className="ChoiceInfo-deleteBtn"
                            >
                                DELETE
                            </button>
                        )}
                    </div>
                    {floatingAlert && <Alert text="선택 완료!" />}
                    {floatingDeleteAlert && <Alert text="삭제중.." />}
                    {modaling && (
                        <Modal
                            type="delete"
                            text="정말 이 질문을 삭제할까요?"
                            deleteContent={deleteContent}
                        />
                    )}
                    {imgModaling && (
                        <Modal
                            type="img"
                            img={clickedImg}
                            deleteContent={toggleImgModal}
                        />
                    )}
                </article>
            )}
        </>
    );
};

export default ChoiceInfo;
