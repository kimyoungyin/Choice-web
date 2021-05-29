import React, { useEffect, useState } from "react";
import { dbService } from "../fb";
import "../CSS/Home.css";
import ChoiceContent from "../components/ChoiceContent";
const Home = ({ userObj }) => {
    const [uploadMode, setUploadMode] = useState(false);
    const [question, setQuestion] = useState("");
    const [choice1, setChoice1] = useState("");
    const [choice2, setChoice2] = useState("");
    const [choiceItems, setChoiceItems] = useState([]);
    useEffect(() => {
        dbService.collection("questions").onSnapshot((snapshot) => {
            const questions = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            questions.sort((a, b) => {
                if (a.when > b.when) return -1;
                if (a.when < b.when) return 1;

                return 0;
            });
            setChoiceItems(questions);
        });

        return () => {
            setChoiceItems([]);
        };
    }, []);

    const toggleUpload = () => {
        setUploadMode((prev) => !prev);
    };

    const onChange = (e) => {
        const {
            target: { name, value },
        } = e;
        if (name === "question") {
            setQuestion(value);
        } else if (name === "choice1") {
            setChoice1(value);
        } else if (name === "choice2") {
            setChoice2(value);
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setUploadMode(false);
        dbService.collection("questions").add({
            question: question,
            choice1: choice1,
            choice2: choice2,
            select1: 0,
            select2: 0,
            when: Date.now(),
        });
        setQuestion("");
        setChoice1("");
        setChoice2("");
    };

    return (
        <div className="Home">
            {!uploadMode ? (
                <>
                    <div className="Home-list">
                        {choiceItems.map((item) => (
                            <ChoiceContent
                                key={item.id}
                                item={item}
                                userObj={userObj}
                            />
                        ))}
                    </div>
                    <button className="Home-button" onClick={toggleUpload}>
                        +
                    </button>
                </>
            ) : (
                <form className="Home-form" onSubmit={onSubmit}>
                    <input
                        className="Home-question"
                        type="text"
                        value={question}
                        name="question"
                        onChange={onChange}
                        required
                    />
                    <div className="Home-choices">
                        <input
                            className="Home-choice1"
                            type="text"
                            value={choice1}
                            name="choice1"
                            onChange={onChange}
                            required
                        />
                        <input
                            className="Home-choice2"
                            type="text"
                            value={choice2}
                            name="choice2"
                            onChange={onChange}
                            required
                        />
                    </div>
                    <button type="submit" className="Home-button">
                        Upload
                    </button>
                </form>
            )}
        </div>
    );
};

export default Home;
