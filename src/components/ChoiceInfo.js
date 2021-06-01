import React, { useEffect, useState } from "react";
import { dbService } from "../fb";
import "../CSS/ChoiceInfo.css";

const ChoiceInfo = ({ item, userObj, toggleChoiceMode }) => {
    // const [choice1Array, setChoice1Array] = useState([]);
    // const [choice2Array, setChoice2Array] = useState([]);
    const [init, setInit] = useState(false);
    const [choice1Users, setChoice1Users] = useState(0);
    const [choice2Users, setChoice2Users] = useState(0);

    useEffect(() => {
        const document = dbService.collection("questions").doc(item.id);
        document
            .get()
            .then(() => {
                document
                    .collection("choice1Users")
                    .limit(1)
                    .get()
                    .then((sub) => setChoice1Users(sub.size));
                document
                    .collection("choice2Users")
                    .limit(1)
                    .get()
                    .then((sub) => setChoice2Users(sub.size));
            })
            .catch(function (error) {
                console.log("Error getting document:", error);
            });
        setInit(true);
    }, [item.id, init]);

    // const handleChoice = (size) => {
    //     if (size === 0) {
    //         console.log("서브컬렉션이 없습니다.");
    //     } else {
    //         console.log("서브컬렉션이 있습니다.");
    //     }
    // };

    return (
        <>
            {init && (
                <article className="ChoiceInfo">
                    <div>{item.question}</div>
                    <ul className="ChoiceInfo-ul">
                        <li>
                            {item.choice1} : {choice1Users}
                        </li>
                        <li>
                            {item.choice2} : {choice2Users}
                        </li>
                    </ul>
                    <button onClick={toggleChoiceMode}>완료</button>
                </article>
            )}
        </>
    );
};

export default ChoiceInfo;
