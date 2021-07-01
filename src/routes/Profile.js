import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import Content from "../components/Content";
import { authService, dbService } from "../fb";

const Profile = ({ userObj }) => {
  const history = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };

  const [writed, setWrited] = useState(0);
  const [writedData, setWritedData] = useState([]);

  useEffect(() => {
    const question = dbService.collection("questions");
    question
      .where("writer", "==", userObj.displayName)
      .get()
      .then((querySnapshot) => {
        setWrited(querySnapshot.size);
        const list = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        list.sort((a, b) => {
          if (a.when > b.when) return -1;
          if (a.when < b.when) return 1;

          return 0;
        });
        setWritedData(list);
      });
  }, []);

  return (
    <div className="Profile">
      <h2 className="Profile-title">DASHBOARD</h2>
      <h2 className="Profile-mail">
        오류 및 개선사항 문의 :{" "}
        <a href="mailto:yin199859@gmail.com">yin199859@gmail.com</a>
      </h2>
      <div className="Profile-userInfo">
        <img src={userObj.photo} alt="없음" />
        <div className="Profile-text">
          <div>닉네임 : {userObj.displayName}</div>
          <div>업로드 : {writed}회</div>
          <button onClick={onLogOutClick}>LOGOUT</button>
        </div>
      </div>
      <h3 className="Profile-myTitle">MY QUESTIONS</h3>
      <div className="Profile-questions">
        {writedData.map((item) => (
          <Content key={item.id} item={item} userObj={userObj} />
        ))}
      </div>
    </div>
  );
};

export default Profile;
