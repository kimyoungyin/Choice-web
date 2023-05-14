import { Button, useMediaQuery } from "@chakra-ui/react";

type selectedId = number | null;

interface CategorySelectProps {
    categories: global.Category[];
    selectedId: selectedId;
    onChange: (selectedId: selectedId) => void;
}

const CategorySelect = ({
    categories,
    selectedId,
    onChange,
}: CategorySelectProps) => {
    const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
    const categoryClickHandler = (id: number) => {
        if (selectedId === id) {
            onChange(null);
        } else {
            onChange(id);
        }
    };

    return (
        <>
            {categories.map((categoryObj) => (
                <Button
                    w={isLargerThan768 ? "full" : " auto"}
                    // h={30}
                    boxShadow={"md"}
                    borderRadius={8}
                    variant={"solid"}
                    size={"md"}
                    bgColor={"white"}
                    _hover={{
                        bg: "gray.100",
                        transform: "scale(1.05)",
                    }}
                    _active={{
                        bg: "gray.600",
                        color: "white",
                    }}
                    isActive={categoryObj.id === selectedId}
                    key={categoryObj.id}
                    onClick={() => categoryClickHandler(categoryObj.id)}
                >
                    {categoryObj.name}
                </Button>
            ))}
        </>
    );
};

export default CategorySelect;
