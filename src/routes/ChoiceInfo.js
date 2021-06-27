import React, { useEffect, useState } from "react";
import { dbService, storageService } from "../fb";
import "../style.css";
import { useHistory } from "react-router";

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

    const checkSelected = async (choiceType, documentRef) => {
        await documentRef
            .collection(`choice${choiceType}Users`)
            .where("user", "==", userObj.displayName)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.data().user === userObj.displayName) {
                        if (choiceType === 1) {
                            // console.log("1 발견");
                            setSelected1(true);
                            setBtn1Id("selected");
                            setAlready("selected1");
                            setAlreadyId(doc.id);
                        } else if (choiceType === 2) {
                            // console.log("2 발견");
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
    }, []);

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

    const completeSelect = () => {
        if (already === null) {
            if (selected1) {
                document
                    .collection("choice1Users")
                    .add({ user: userObj.displayName });
                setAlready("selected1");
            } else if (selected2) {
                document
                    .collection("choice2Users")
                    .add({ user: userObj.displayName });
                setAlready("selected2");
            }
        } else if (already === "selected1") {
            if (selected2) {
                document
                    .collection("choice2Users")
                    .add({ user: userObj.displayName });
                document.collection("choice1Users").doc(alreadyId).delete();
                setAlready("selected2");
            } else if (!selected1 && !selected2) {
                document.collection("choice1Users").doc(alreadyId).delete();
                setAlready(null);
            }
        } else if (already === "selected2") {
            if (selected1) {
                document
                    .collection("choice1Users")
                    .add({ user: userObj.displayName });
                document.collection("choice2Users").doc(alreadyId).delete();
                setAlready("selected1");
            } else if (!selected1 && !selected2) {
                document.collection("choice2Users").doc(alreadyId).delete();
                setAlready(null);
            }
        }
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

    const deleteContent = async () => {
        const ok = window.confirm("정말 이 질문을 삭제하겠습니까?");
        if (ok) {
            await document.delete();
            await storageService.refFromURL(item.attachment1Url).delete();
            await storageService.refFromURL(item.attachment2Url).delete();
            goToHome();
        }
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
                        </div>
                        <div className="ChoiceInfo-choice2">
                            {item.attachment2Url && (
                                <img
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
                        </div>
                    </div>

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
                        {checkChangeSelected(already) ? "COMPLETE" : "DISABLED"}
                    </button>

                    <div className="ChoiceInfo-fixedBtns">
                        <button
                            className="ChoiceInfo-homeBtn"
                            onClick={goToHome}
                        >
                            HOME
                        </button>
                        {userObj.displayName === item.writer && (
                            <button
                                onClick={deleteContent}
                                className="ChoiceInfo-deleteBtn"
                            >
                                DELETE
                            </button>
                        )}
                    </div>
                </article>
            )}
        </>
    );
};

export default ChoiceInfo;
