import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
    Button,
    Center,
    Flex,
    Heading,
    IconButton,
    Spacer,
    Text,
    useColorMode,
    useMediaQuery,
} from "@chakra-ui/react";
import customAixos from "customAixos";
import { auth } from "fb";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";

interface HeaderProps {
    isLoggedIn: boolean;
    setLoggedInState: (state: boolean) => void;
}

const Header = ({ isLoggedIn, setLoggedInState }: HeaderProps) => {
    const { toggleColorMode, colorMode } = useColorMode();
    const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
    const logoutHandler = () => {
        setLoggedInState(false);
        signOut(auth);
        delete customAixos.defaults.headers.common["Authorization"];
    };

    const loginHandler = async () => {
        let provider;
        try {
            provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            setLoggedInState(true);
        } catch (err) {
            // error의 타입 정의하기
            if (!(err instanceof Error)) return;
            console.log(err);
        }
    };

    return (
        <Flex
            align={"center"}
            gap={4}
            position={"fixed"}
            top="0"
            px={4}
            py={8}
            w={"100%"}
            h={50}
            borderBottom={"1px"}
            borderColor={"gray.200"}
            bg={colorMode === "dark" ? "gray.700" : "white"}
        >
            <Heading as={"h1"} display={"flex"}>
                <Text color={"pink.500"}>yy</Text>
                Choice
            </Heading>
            <Spacer />
            <IconButton
                cursor={"pointer"}
                colorScheme="pink"
                variant={"outline"}
                p={2.5}
                aria-label="Toggle Color Mode"
                onClick={toggleColorMode}
                as={colorMode === "light" ? MoonIcon : SunIcon}
            >
                Toggle Color Mode
            </IconButton>
            <Button
                variant={"outline"}
                leftIcon={
                    isLoggedIn || !isLargerThan768 ? undefined : <FcGoogle />
                }
                onClick={isLoggedIn ? logoutHandler : loginHandler}
            >
                <Center>
                    <Text fontSize={"xl"} fontWeight={"normal"}>
                        {isLoggedIn ? (
                            "Logout"
                        ) : isLargerThan768 ? (
                            "Sign in with Google"
                        ) : (
                            <FcGoogle />
                        )}
                    </Text>
                </Center>
            </Button>
        </Flex>
    );
};

export default Header;
