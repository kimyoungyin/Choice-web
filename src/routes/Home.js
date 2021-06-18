import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "../fb";
import "../CSS/Home.css";
import Content from "../components/Content";
import AddForm from "../components/AddForm";
const Home = ({ userObj }) => {
    const [uploadMode, setUploadMode] = useState(false);
    const [choiceItems, setChoiceItems] = useState([]);
    const [question, setQuestion] = useState("");
    const [choice1, setChoice1] = useState("");
    const [choice2, setChoice2] = useState("");
    const [attachment1, setAttachment1] = useState("");
    const [attachment2, setAttachment2] = useState("");

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

    const onSubmit = async (e) => {
        e.preventDefault();
        setUploadMode(false);
        let attachment1Url = "";
        let attachment2Url = "";
        if (attachment1 !== "" && attachment2 !== "") {
            const attachmentRef = storageService
                .ref()
                .child(`${userObj.email}/${uuidv4()}`);
            const response1 = await attachmentRef.putString(
                attachment1,
                "data_url"
            );
            const response2 = await attachmentRef.putString(
                attachment2,
                "data_url"
            );
            attachment1Url = await response1.ref.getDownloadURL();
            attachment2Url = await response2.ref.getDownloadURL();
        } else if (attachment1 !== "") {
            const attachmentRef = storageService
                .ref()
                .child(`${userObj.email}/${uuidv4()}`);
            const response1 = await attachmentRef.putString(
                attachment1,
                "data_url"
            );
            attachment1Url = await response1.ref.getDownloadURL();
        } else if (attachment2 !== "") {
            const attachmentRef = storageService
                .ref()
                .child(`${userObj.email}/${uuidv4()}`);
            const response2 = await attachmentRef.putString(
                attachment2,
                "data_url"
            );
            attachment2Url = await response2.ref.getDownloadURL();
        }
        const contentObj = {
            question: question,
            choice1: choice1,
            choice2: choice2,
            when: Date.now(),
            writer: userObj.displayName,
            attachment1Url,
            attachment2Url,
        };
        await dbService.collection("questions").add(contentObj);
        setQuestion("");
        setChoice1("");
        setChoice2("");
        setAttachment1("");
        setAttachment2("");
    };

    const cancelAdd = () => {
        setUploadMode(false);
    };

    const onFileChange = (event) => {
        const {
            target: { files, className },
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: { result },
            } = finishedEvent;
            if (className === "AddForm-choice1Img") {
                setAttachment1(result);
            } else if (className === "AddForm-choice2Img") {
                setAttachment2(result);
            }
        };
        reader.readAsDataURL(theFile);
    };

    const onClearAttachment1 = () => {
        const file = document.querySelector(".AddForm-choice1Img");
        file.value = "";
        setAttachment1("");
    };

    const onClearAttachment2 = () => {
        const file = document.querySelector(".AddForm-choice2Img");
        file.value = "";
        setAttachment2("");
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
                    onFileChange={onFileChange}
                    attachment1={attachment1}
                    attachment2={attachment2}
                    onClearAttachment1={onClearAttachment1}
                    onClearAttachment2={onClearAttachment2}
                />
            )}
        </div>
    );
};

export default Home;
