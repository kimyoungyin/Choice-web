import { useMediaQuery } from "@chakra-ui/react";

const useThreeMediaQuery = () => {
    const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
    const [isLargerThan1024] = useMediaQuery("(min-width: 1024px)");
    const [isLargerThan1440] = useMediaQuery("(min-width: 1440px)");

    return { isLargerThan768, isLargerThan1024, isLargerThan1440 };
};
export default useThreeMediaQuery;
