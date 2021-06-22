import React from "react";
import { useHistory } from "react-router";
import "../style.css";

const Content = ({ item, userObj }) => {
    const history = useHistory();
    // const toggleChoiceMode = () => {
    //     const homeList = document.querySelector(".Home-list");
    // };

    const goToChoiceInfo = () => {
        history.push(`/detail/${item.id}`);
    };

    return (
        <section className="Content" onClick={goToChoiceInfo}>
            <article className="Content-list">
                <div>작성자 {item.writer}</div>
                <div>{item.question}</div>
            </article>
            {/* <ChoiceInfo
                    item={item}
                    userObj={userObj}
                    toggleChoiceMode={toggleChoiceMode}
                /> */}
        </section>
    );
};

export default Content;
