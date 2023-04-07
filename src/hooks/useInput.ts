import { ChangeEvent, useState } from "react";

const useInput = (initialValue: string) => {
    const [value, setValue] = useState(initialValue);
    const onChange = (
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const value = event.currentTarget.value;
        setValue(value);
    };
    return { value, onChange };
};

export default useInput;
