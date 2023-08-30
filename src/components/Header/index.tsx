import { Link } from "react-router-dom";

import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
    Flex,
    Heading,
    IconButton,
    Spacer,
    Stack,
    Text,
    useColorMode,
    useColorModeValue,
    useMediaQuery,
} from "@chakra-ui/react";

import TopNav from "components/Header/TopNav";

interface HeaderProps {
    isLoggedIn: boolean;
    userObj: global.User | null;
    setLoggedInState: (state: boolean) => void;
}

const Header = ({ isLoggedIn, userObj, setLoggedInState }: HeaderProps) => {
    const { toggleColorMode } = useColorMode();
    const borderColor = useColorModeValue("gray.200", "pink.500");
    const bgColor = useColorModeValue("white", "gray.800");
    const headerBorderBottom = useColorModeValue("1px", "none");
    const colorModeIcon = useColorModeValue(MoonIcon, SunIcon);
    const textColor = useColorModeValue("black", "gray.200");
    const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
    const [isLargerThan1024] = useMediaQuery("(min-width: 1024px)");

    return (
        <Flex
            as={"header"}
            justify={"center"}
            position={"fixed"}
            zIndex={50}
            top="0"
            px={4}
            w={"100%"}
            h={65}
            borderBottom={headerBorderBottom}
            borderColor={borderColor}
            bg={bgColor}
            color={textColor}
        >
            <Flex align={"center"} gap={4} w={"100%"} maxW={1440}>
                <Heading as={Link} to={"/"} display={"flex"}>
                    <Text color={"pink.500"}>yy</Text>
                    Choice
                </Heading>
                <Spacer />
                <Stack spacing={8} direction={"row"} align={"center"}>
                    <IconButton
                        cursor={"pointer"}
                        colorScheme="pink"
                        variant={"outline"}
                        p={2.5}
                        aria-label="Toggle Color Mode"
                        onClick={toggleColorMode}
                        as={colorModeIcon}
                    >
                        Toggle Color Mode
                    </IconButton>
                    {isLoggedIn && userObj ? (
                        <TopNav.Authorized
                            userObj={userObj}
                            onLogout={() => setLoggedInState(false)}
                            device={
                                isLargerThan1024
                                    ? "desktop"
                                    : isLargerThan768
                                    ? "tablet"
                                    : "mobile"
                            }
                        />
                    ) : (
                        <TopNav.Common
                            onLogin={() => setLoggedInState(true)}
                            device={
                                isLargerThan1024
                                    ? "desktop"
                                    : isLargerThan768
                                    ? "tablet"
                                    : "mobile"
                            }
                        />
                    )}
                </Stack>
            </Flex>
        </Flex>
    );
};

export default Header;
