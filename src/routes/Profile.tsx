import { Box, Flex } from "@chakra-ui/react";
import Content from "components/Content";
import customAixos from "customAixos";
import { useEffect, useState } from "react";

const Profile = ({ userObj }: { userObj: global.User }) => {
    const [writed, setWrited] = useState(0);
    const [writedData, setWritedData] = useState<global.PostWithChoiceCount[]>(
        []
    );

    useEffect(() => {
        const getUserPost = async () => {
            try {
                const { data } = await customAixos.get<
                    global.PostWithChoiceCount[]
                >(`/posts/profile`);
                setWrited(data.length);
                setWritedData(data);
            } catch (error) {
                console.log(error);
            }
        };
        getUserPost();
    }, []);

    return (
        <Box className="Profile" bg={"gray.200"}>
            <h2 className="Profile-title">DASHBOARD</h2>
            <h2 className="Profile-mail">
                오류 및 개선사항 문의 :{" "}
                <a href="mailto:yin199859@gmail.com">yin199859@gmail.com</a>
            </h2>
            <div className="Profile-userInfo">
                <img src={userObj.photoUrl} alt="없음" />
                <div className="Profile-text">
                    <div>닉네임 : {userObj.displayName}</div>
                    <div>업로드 : {writed}회</div>
                </div>
            </div>
            <h3 className="Profile-myTitle">MY QUESTIONS</h3>
            <Flex
                className="Profile-questions"
                as="section"
                bg={"gray.200"}
                w={"100%"}
                h={"100%"}
                overflow={"auto"}
                p={8}
                wrap={"wrap"}
                alignContent={"flex-start"}
            >
                {writedData.map((item) => (
                    <Content key={item.id} item={item} />
                ))}
            </Flex>
        </Box>
    );
};

export default Profile;
