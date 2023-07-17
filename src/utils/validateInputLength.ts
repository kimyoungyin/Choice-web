import { RefObject } from "react";

const validateInputLength = (
    text: string,
    maxLength: number,
    emptyAlert: string,
    longTextAlert: string,
    inputRef: RefObject<HTMLInputElement | HTMLSelectElement>
) => {
    if (text === "") {
        alert(emptyAlert);
        inputRef.current?.focus();
        return false;
    } else if (text.length > maxLength) {
        alert(longTextAlert);
        inputRef.current?.focus();
        return false;
    } else {
        return true;
    }
};
export default validateInputLength;
