import {
    Avatar,
    Button,
    IconButton,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Portal,
} from "@chakra-ui/react";
import { auth } from "fb";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { Link, useLocation } from "react-router-dom";

interface MediaQueryType {
    device: "mobile" | "tablet" | "desktop";
}

interface CommonProps extends MediaQueryType {
    onLogin: () => void;
}

const Common = ({ onLogin, device }: CommonProps) => {
    const loginHandler = async () => {
        let provider;
        try {
            provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            onLogin();
        } catch (err) {
            // error의 타입 정의하기
            if (!(err instanceof Error)) return;
            console.log(err);
        }
    };

    if (device === "mobile")
        return (
            <IconButton
                aria-label="구글 로그인"
                icon={<FcGoogle />}
                bgColor={"white"}
                border={"1px"}
                borderColor={"black"}
                onClick={loginHandler}
            />
        );

    return (
        <Button
            bgColor={"white"}
            border={"1px"}
            borderColor={"black"}
            leftIcon={<FcGoogle />}
            onClick={loginHandler}
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
                <Button variant={"unstyled"} fontSize={"lg"}>
                    <Link to="/">홈</Link>
                </Button>
                <Button variant={"unstyled"} fontSize={"lg"}>
                    <Link to="/profile">내 프로필</Link>
                </Button>
                <Button
                    variant={"unstyled"}
                    fontSize={"lg"}
                    onClick={logoutHandler}
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
                    <MenuItem as={Link} to={"/"} isDisabled={pathname === "/"}>
                        홈
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem
                        as={Link}
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
