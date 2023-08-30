import { NavLink, useLocation } from "react-router-dom";

import {
    Avatar,
    Button,
    IconButton,
    Link,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Portal,
    useColorModeValue,
} from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";

import { auth } from "fb";
import { signOut } from "firebase/auth";
import useGoogleLogin from "hooks/useGoogleLogin";

interface MediaQueryType {
    device: "mobile" | "tablet" | "desktop";
}

interface CommonProps extends MediaQueryType {
    onLogin: () => void;
}

const Common = ({ onLogin, device }: CommonProps) => {
    const startGoogleLogin = useGoogleLogin(onLogin);
    const googleButtonColor = useColorModeValue("white", "black");

    if (device === "mobile")
        return (
            <IconButton
                aria-label="구글 로그인"
                icon={<FcGoogle />}
                bgColor={"white"}
                border={"1px"}
                borderColor={"black"}
                onClick={startGoogleLogin}
            />
        );

    return (
        <Button
            bgColor={googleButtonColor}
            border={"1px"}
            borderColor={"black"}
            leftIcon={<FcGoogle />}
            onClick={startGoogleLogin}
        >
            Sign in with Google
        </Button>
    );
};

interface AuthorizedProps extends MediaQueryType {
    userObj: global.User;
    onLogout: () => void;
}

const Authorized = ({ userObj, onLogout, device }: AuthorizedProps) => {
    const { pathname } = useLocation();
    const logoutHandler = () => {
        onLogout();
        // userObj 삭제 로직도 추가
        signOut(auth);
    };

    const MyImage = () => (
        <Avatar
            name={userObj.displayName}
            src={userObj.photoUrl}
            h={"40px"}
            w={"40px"}
            boxShadow={"md"}
        />
    );

    if (device === "desktop")
        return (
            <>
                <Button variant={"unstyled"} color={"red"} fontSize={"lg"}>
                    <Link
                        as={NavLink}
                        to="/upload"
                        display={"block"}
                        h={"full"}
                        lineHeight={"40px"}
                    >
                        업로드
                    </Link>
                </Button>
                <Button variant={"unstyled"} fontSize={"lg"}>
                    <Link
                        as={NavLink}
                        to="/"
                        display={"block"}
                        h={"full"}
                        lineHeight={"40px"}
                    >
                        홈
                    </Link>
                </Button>
                <Button variant={"unstyled"} fontSize={"lg"}>
                    <Link
                        as={NavLink}
                        to="/profile"
                        display={"block"}
                        h={"full"}
                        lineHeight={"40px"}
                    >
                        내 프로필
                    </Link>
                </Button>
                <Button
                    variant={"unstyled"}
                    fontSize={"lg"}
                    onClick={logoutHandler}
                    display={"block"}
                    h={"full"}
                    lineHeight={"40px"}
                >
                    로그아웃
                </Button>
                <MyImage />
            </>
        );

    return (
        <Menu autoSelect={false}>
            <MenuButton>
                <MyImage />
            </MenuButton>
            <Portal>
                <MenuList>
                    <MenuItem
                        as={NavLink}
                        to={"/"}
                        isDisabled={pathname === "/"}
                    >
                        홈
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem
                        as={NavLink}
                        to={"/profile"}
                        isDisabled={pathname === "/profile"}
                    >
                        내 프로필
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem onClick={logoutHandler}>로그아웃</MenuItem>
                </MenuList>
            </Portal>
        </Menu>
    );
};

const TopNav = { Authorized, Common };

export default TopNav;
