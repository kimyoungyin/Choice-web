import React, { useState } from "react";
import ChoiceInfo from "./ChoiceInfo";
import "../CSS/Content.css";

const Content = ({ item, userObj }) => {
    const [choiceMode, setChoiceMode] = useState(false);

    const toggleChoiceMode = () => {
        setChoiceMode((prev) => !prev);
        // const contentList = document.querySelectorAll(".Content-list");
        // if (choiceMode === false) {
        //     for (let x = 0; x < contentList.length; x++)
        //         contentList[x].style.display = "none";
        // } else if (choiceMode === true) {
        //     for (let y = 0; y < contentList.length; y++)
        //         contentList[y].style.display = "block";
        // }
    };

    return (
        <section className="Content">
            {!choiceMode ? (
                <article onClick={toggleChoiceMode} className="Content-list">
                    <div>작성자 {userObj.email}</div>
                    <div>{item.question}</div>
                </article>
            ) : (
                <ChoiceInfo
                    item={item}
                    userObj={userObj}
                    toggleChoiceMode={toggleChoiceMode}
                />
            )}
        </section>
    );
};

export default Content;
