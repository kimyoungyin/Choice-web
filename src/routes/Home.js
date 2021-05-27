import React, { useEffect, useState } from "react";
import { dbService } from "../fb";
import "../CSS/Home.css";

const Home = () => {
    const [uploadMode, setUploadMode] = useState(false);
    // const [choiceItem, setChoiceItem] = useState("");
    const [choiceItems, setChoiceItems] = useState([]);
    useEffect(() => {
        dbService.collection("questions").onSnapshot((snapshot) => {
            const questions = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setChoiceItems(questions);
        });
    }, []);

    const toggleUpload = () => {
        setUploadMode((prev) => !prev);
    };

    return (
        <div className="Home">
            {!uploadMode ? (
                <>
                    {choiceItems.map((item) => (
                        <div key={item.id}>{item.text}</div>
                    ))}
                    <button className="Home-button" onClick={toggleUpload}>
                        +
                    </button>
                </>
            ) : (
                <>
                    <div>작성해주세요</div>
                    <button className="Home-button" onClick={toggleUpload}>
                        Upload
                    </button>
                </>
            )}
        </div>
    );
};

export default Home;
