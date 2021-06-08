import React, { useEffect, useState } from "react";
import { dbService } from "../fb";
import "../CSS/ChoiceInfo.css";
import { useHistory } from "react-router";

const ChoiceInfo = ({ match, userObj }) => {
    const history = useHistory();
    const [init, setInit] = useState(false);
    const [document, setDocument] = useState(null);
    const [choice1Users, setChoice1Users] = useState(0);
    const [choice2Users, setChoice2Users] = useState(0);
    const [item, setItem] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const idRef = match.params.id;
            const documentRef = await dbService
                .collection("questions")
                .doc(idRef);
            const itemRef = await documentRef.get().then((doc) => doc.data());
            const itemWithId = {
                ...itemRef,
                id: idRef,
            };
            documentRef
                .get()
                .then(() => {
                    documentRef
                        .collection("choice1Users")
                        .limit(1)
                        .get()
                        .then((sub) => setChoice1Users(sub.size));
                    documentRef
                        .collection("choice2Users")
                        .limit(1)
                        .get()
                        .then((sub) => setChoice2Users(sub.size));
                })
                .catch(function (error) {
                    console.log("Error getting document:", error);
                });
            setDocument(documentRef);
            setItem(itemWithId);
            setInit(true);
        };
        fetchData();

        return () => setDocument(null);
    }, [match, document, item, init]);

    const addUser = (e) => {
        const { target: className } = e;
        console.log(e.target);
    };

    const goToHome = () => {
        history.push("/");
    };
    return (
        <>
            {init && (
                <article className="ChoiceInfo">
                    <h2>{item.question}</h2>
                    <h3>작성자 {item.writer}</h3>
                    <ul className="ChoiceInfo-ul">
                        <li>
                            <section
                                className="ChoiceInfo-choice1"
                                onClick={addUser}
                            >
                                <h4>{item.choice1}</h4>
                                <h5>{choice1Users}</h5>
                            </section>
                        </li>
                        <li>
                            <section
                                className="ChoiceInfo-choice2"
                                onClick={addUser}
                            >
                                <h4>{item.choice2} </h4>
                                <h5>{choice2Users}</h5>
                            </section>
                        </li>
                    </ul>
                    <button onClick={goToHome}>완료</button>
                </article>
            )}
        </>
    );
};

export default ChoiceInfo;
