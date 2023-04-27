import { Box, Grid } from "@chakra-ui/react";
import Content from "components/Content";
import customAixos from "customAixos";
import useThreeMediaQuery from "hooks/useThreeMediaQuery";
import { useEffect, useState } from "react";

const Profile = ({ userObj }: { userObj: global.User }) => {
    const mediaQueryObj = useThreeMediaQuery();
    const [writed, setWrited] = useState(0);
    const [writedData, setWritedData] = useState<global.Post[]>([]);

    useEffect(() => {
        const getUserPost = async () => {
            try {
                const { data } = await customAixos.get(`/posts/profile`);
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
            <Grid
                className="Profile-questions"
                gap={16}
                templateColumns={`repeat(${
                    !mediaQueryObj.isLargerThan768
                        ? 1
                        : !mediaQueryObj.isLargerThan1024
                        ? 2
                        : !mediaQueryObj.isLargerThan1440
                        ? 3
                        : 4
                }, 1fr)`}
            >
                {writedData.map((item) => (
                    <Content key={item.id} item={item} />
                ))}
            </Grid>
        </Box>
    );
};

export default Profile;
