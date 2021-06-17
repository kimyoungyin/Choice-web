import React, { useEffect, useState } from "react";
import { dbService } from "../fb";
import "../CSS/Home.css";
import Content from "../components/Content";
import AddForm from "../components/AddForm";
const Home = ({ userObj }) => {
    const [uploadMode, setUploadMode] = useState(false);
    const [choiceItems, setChoiceItems] = useState([]);
    const [question, setQuestion] = useState("");
    const [choice1, setChoice1] = useState("");
    const [choice2, setChoice2] = useState("");

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
            when: Date.now(),
            writer: userObj.displayName,
        });
        setQuestion("");
        setChoice1("");
        setChoice2("");
    };

    const cancelAdd = () => {
        setUploadMode(false);
    };

    return (
        <div className="Home">
            {!uploadMode ? (
                <>
                    <div className="Home-list">
                        {choiceItems.map((item) => (
                            <Content
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
                <AddForm
                    onChange={onChange}
                    onSubmit={onSubmit}
                    choice1={choice1}
                    choice2={choice2}
                    cancelAdd={cancelAdd}
                />
            )}
        </div>
    );
};

export default Home;
