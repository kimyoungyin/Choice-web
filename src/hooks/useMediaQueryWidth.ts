import { useMediaQuery } from "@chakra-ui/react";

const useMediaQueryWidth = (
    widthSmallerThan768?: number | string,
    widthLargerThan768?: number | string,
    widthLargerThan1024?: number | string,
    widthLargerThan1440?: number | string,
    widthLargerThan2560?: number | string
) => {
    const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
    const [isLargerThan1024] = useMediaQuery("(min-width: 1024px)");
    const [isLargerThan1440] = useMediaQuery("(min-width: 1440px)");
    const [isLargerThan2560] = useMediaQuery("(min-width: 2560px)");
    if (widthLargerThan2560 && isLargerThan2560) return widthLargerThan2560;
    if (widthLargerThan1440 && isLargerThan1440) return widthLargerThan1440;
    if (widthLargerThan1024 && isLargerThan1024) return widthLargerThan1024;
    if (widthLargerThan768 && isLargerThan768) return widthLargerThan768;
    if (widthSmallerThan768 && !isLargerThan768) return widthSmallerThan768;
    else return 0;
};
export default useMediaQueryWidth;
