import { Flex, Heading, Image, Link, Text } from "@chakra-ui/react";
import Content from "components/Content";
import { authorizedCustomAxios } from "customAxios";
import { useEffect, useState } from "react";

const Profile = ({ userObj }: { userObj: global.User }) => {
    const [writed, setWrited] = useState(0);
    const [writedData, setWritedData] = useState<global.PostWithChoiceCount[]>(
        []
    );

    useEffect(() => {
        const getUserPost = async () => {
            try {
                const { data } = await authorizedCustomAxios.get<
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
        <Flex
            bg={"gray.200"}
            pt={"65px"}
            flexDir={"column"}
            align={"center"}
            h={"full"}
        >
            <Heading mt={10} as={"h3"}>
                DASHBOARD
            </Heading>
            <Link
                href="mailto:yin199859@gmail.com"
                mt={5}
                textDecor={"underline"}
            >
                오류 및 개선사항 문의하기: yin199859@gmail.com
            </Link>
            <Flex
                w={"full"}
                justify={"space-around"}
                align={"center"}
                mt={5}
                py={5}
                bg={"white"}
                borderRadius={"md"}
            >
                <Image src={userObj.photoUrl} alt="없음" boxShadow={"md"} />
                <Flex flexDir={"column"} gap={2}>
                    <Text fontWeight={"semibold"} fontSize={"lg"}>
                        닉네임 : {userObj.displayName}
                    </Text>
                    <Text
                        fontWeight={"semibold"}
                        fontSize={"lg"}
                        color={"pink.500"}
                    >
                        업로드 : {writed.toString()}회
                    </Text>
                </Flex>
            </Flex>
            <Heading as={"h4"} size={"lg"} mt={10}>
                MY QUESTIONS
            </Heading>
            <Flex
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
        </Flex>
    );
};

export default Profile;
