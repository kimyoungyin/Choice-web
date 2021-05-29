import React, { useState } from "react";
import { dbService } from "../fb";

const ChoiceContent = ({ item, userObj }) => {
    const [choice1Array, setChoice1Array] = useState([]);
    const [choice2Array, setChoice2Array] = useState([]);
    const document = dbService.collection("questions").doc(item.id);

    const handleChoice = (size) => {
        if (size === 0) {
            console.log("서브컬렉션이 없습니다.");
        } else {
            console.log("서브컬렉션이 있습니다.");
        }
    };

    const countChoice = (e) => {
        const {
            target: { name },
        } = e;
        // const choice1Users = dbService
        //     .collection("questions")
        //     .doc(item.id)
        //     .collection("choice1Users");
        // const choice2Users = dbService
        //     .collection("questions")
        //     .doc(item.id)
        //     .collection("choice2Users");
        if (name === "choice1") {
            document
                .get()
                .then(() => {
                    document
                        .collection("choice1Users")
                        .limit(1)
                        .get()
                        .then((sub) => handleChoice(sub.size));
                    // if (doc.exists) {

                    //     setChoice1Array((choice1Array) => [
                    //         ...choice1Array,
                    //         doc.data(),
                    //     ]);
                    //     console.log(choice1Array);
                    //     console.log(doc.data());
                    // } else {
                    //     choice1Users.add({ user: userObj.email });
                    //     setChoice1Array([{ user: userObj.email }]);
                    //     console.log(choice1Array);
                    //     console.log("콜렉션없음");
                    // }
                })
                .catch(function (error) {
                    console.log("Error getting document:", error);
                });
        }
    };
    return (
        <div>
            <div>작성자 {userObj.email}</div>
            <div>{item.question}</div>
            <button name="choice1" onClick={countChoice}>
                {item.choice1} : {item.select1}
            </button>
            <button name="choice2" onClick={countChoice}>
                {item.choice2} : {item.select2}
            </button>
        </div>
    );
};

export default ChoiceContent;
