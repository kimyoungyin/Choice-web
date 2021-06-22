import React, { useEffect, useState } from "react";
import { dbService, storageService } from "../fb";
import "../CSS/ChoiceInfo.css";
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
    const [already, setAlready] = useState(0);
    const [alreadyId, setAlreadyId] = useState(null);

    const checkSelected = async (choiceType, documentRef) => {
        await documentRef
            .collection(`choice${choiceType}Users`)
            .where("user", "==", userObj.displayName)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.data().user === userObj.displayName) {
                        if (choiceType === 1) {
                            console.log("1 발견");
                            setSelected1(true);
                            setAlready(1);
                            setAlreadyId(doc.id);
                        } else if (choiceType === 2) {
                            console.log("2 발견");
                            setSelected2(true);
                            setAlready(2);
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
        } else if (selected1 && !selected2) {
            setChoice1Users(choice1Users - 1);
            setSelected1(false);
        } else if (!selected1 && selected2) {
            setChoice1Users(choice1Users + 1);
            setChoice2Users(choice2Users - 1);
            setSelected1(true);
            setSelected2(false);
        }
    };

    const addChoice2User = () => {
        if (!selected1 && !selected2) {
            setChoice2Users(choice2Users + 1);
            setSelected2(true);
        } else if (selected2 && !selected1) {
            setChoice2Users(choice2Users - 1);
            setSelected2(false);
        } else if (!selected2 && selected1) {
            setChoice2Users(choice2Users + 1);
            setChoice1Users(choice1Users - 1);
            setSelected2(true);
            setSelected1(false);
        }
    };

    const completeSelect = () => {
        if (already === 0) {
            if (selected1) {
                document
                    .collection("choice1Users")
                    .add({ user: userObj.displayName });
            } else if (selected2) {
                document
                    .collection("choice2Users")
                    .add({ user: userObj.displayName });
            }
        } else if (already === 1) {
            if (selected2) {
                document
                    .collection("choice2Users")
                    .add({ user: userObj.displayName });
                document.collection("choice1Users").doc(alreadyId).delete();
            } else if (!selected1 && !selected2) {
                document.collection("choice1Users").doc(alreadyId).delete();
            }
        } else if (already === 2) {
            if (selected1) {
                document
                    .collection("choice1Users")
                    .add({ user: userObj.displayName });
                document.collection("choice2Users").doc(alreadyId).delete();
            } else if (!selected1 && !selected2) {
                document.collection("choice2Users").doc(alreadyId).delete();
            }
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
                    <h2>{item.question}</h2>
                    <h3>작성자 {item.writer}</h3>
                    <div className="ChoiceInfo-choices">
                        <section className="ChoiceInfo-choice1">
                            <h4>{item.choice1}</h4>
                            <h5>{choice1Users}</h5>
                            {item.attachment1Url && (
                                <img src={item.attachment1Url} alt="choice1" />
                            )}
                            <button onClick={addChoice1User}>
                                {selected1 ? "선택함" : "선택하기"}
                            </button>
                        </section>
                        <section className="ChoiceInfo-choice2">
                            <h4>{item.choice2} </h4>
                            <h5>{choice2Users}</h5>
                            {item.attachment2Url && (
                                <img src={item.attachment2Url} alt="choice2" />
                            )}
                            <button onClick={addChoice2User}>
                                {selected2 ? "선택함" : "선택하기"}
                            </button>
                        </section>
                    </div>

                    <div className="choiceInfo-btns">
                        <button onClick={completeSelect}>
                            {selected1 || selected2 ? "변경" : "취소"}
                        </button>
                        <button onClick={deleteContent}>Delete</button>
                        <button onClick={goToHome}>Home으로</button>
                    </div>
                </article>
            )}
        </>
    );
};

export default ChoiceInfo;
