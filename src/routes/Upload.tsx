import {
    ChangeEvent,
    FormEvent,
    Fragment,
    useEffect,
    useRef,
    useState,
} from "react";
import { useNavigate } from "react-router-dom";

import {
    Button,
    Center,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Image,
    Input,
    Radio,
    RadioGroup,
    Select,
    useColorModeValue,
} from "@chakra-ui/react";

import imageCompression, { Options } from "browser-image-compression";
import { authorizedCustomAxios, customAxios } from "customAxios";
import useInput from "hooks/useInput";
import changePageMetaTags from "utils/changePageMetaTags";
import validateInputLength from "utils/validateInputLength";

interface UploadProps {
    userObj: global.User;
    onStartUpload: () => void;
    onCompleteUpload: () => void;
}

interface ChoiceImage {
    file: File;
    previewUrl: string;
}

const SIZE_LIMIT_MB = 1;
const CATEGORY_MAXLENGTH = 10;
const TITLE_MAXLENGTH = 20;
const CHOICE_MAXLENGTH = 10;

const Upload = ({ userObj, onStartUpload, onCompleteUpload }: UploadProps) => {
    const navigate = useNavigate();
    const [isCategoryFetching, setIsCategoryFetching] = useState(true);
    const [categoryType, setCategoryType] = useState<"current" | "new">(
        "current"
    );
    const [categories, setCategories] = useState<global.Category[]>([]);
    const titleInputProps = useInput("");
    const categorySelectProps = useInput("");
    const categoryInputProps = useInput("");
    const choice1InputProps = useInput("");
    const choice2InputProps = useInput("");
    const [choice1Image, setChoice1Image] = useState<ChoiceImage | null>(null);
    const [choice2Image, setChoice2Image] = useState<ChoiceImage | null>(null);
    const categorySelectRef = useRef<HTMLSelectElement>(null);
    const categoryInputRef = useRef<HTMLInputElement>(null);
    const titleInputRef = useRef<HTMLInputElement>(null);
    const choice1InputRef = useRef<HTMLInputElement>(null);
    const choice2InputRef = useRef<HTMLInputElement>(null);
    const choice1ImageInputRef = useRef<HTMLInputElement>(null);
    const choice2ImageInputRef = useRef<HTMLInputElement>(null);
    const labelBackgroundColor = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("black", "gray.300");

    const CHOICE_INPUT_LAYOUTS: {
        choiceNum: 1 | 2;
        imageInputRef: React.RefObject<HTMLInputElement>;
        inputRef: React.RefObject<HTMLInputElement>;
        inputProps: {
            value: string;
            onChange: (
                event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
            ) => void;
        };
        choiceImage: ChoiceImage | null;
    }[] = [
        {
            choiceNum: 1,
            imageInputRef: choice1ImageInputRef,
            inputRef: choice1InputRef,
            inputProps: choice1InputProps,
            choiceImage: choice1Image,
        },
        {
            choiceNum: 2,
            imageInputRef: choice2ImageInputRef,
            inputRef: choice2InputRef,
            inputProps: choice2InputProps,
            choiceImage: choice2Image,
        },
    ];

    useEffect(() => {
        changePageMetaTags("업로드");
        const asyncFunction = async () => {
            try {
                const { data: categories } =
                    await customAxios.get("/categories");
                setCategories(categories);
                setIsCategoryFetching(false);
            } catch (error) {
                navigate(-1);
            }
        };
        asyncFunction();
    }, [navigate]);

    const handleCategoryRadioChange = (value: string) => {
        setCategoryType(value === "current" ? "current" : "new");
    };

    const clearImageInput = (number: 1 | 2) => {
        if (number === 1 && choice1ImageInputRef.current) {
            choice1ImageInputRef.current.value = "";
            setChoice1Image(null);
        } else if (number === 2 && choice2ImageInputRef.current) {
            choice2ImageInputRef.current.value = "";
            setChoice2Image(null);
        }
    };
    // 업로드 중과 업로드 후 리다이렉트 구현 필요
    const handleFileCHange = async (
        event: ChangeEvent<HTMLInputElement>,
        setState: (newValue: ChoiceImage | null) => void
    ) => {
        const {
            target: { files },
        } = event;
        if (!files) return;
        const file = Array.from(files)[0];
        try {
            const options: Options = {
                maxSizeMB: SIZE_LIMIT_MB,
            };
            const compressedFile = await imageCompression(file, options);
            const reader = new FileReader();
            reader.readAsDataURL(compressedFile);
            reader.onloadend = () => {
                const previewUrl = reader.result as string;
                setState({ file, previewUrl });
            };
        } catch {
            setState(null);
        }
    };

    const validateInput = (
        categoryName: string,
        title: string,
        choice1: string,
        choice2: string
    ) => {
        return (
            validateInputLength(
                categoryName,
                CATEGORY_MAXLENGTH,
                "카테고리를 입력해주세요",
                `카테고리 항목은 최대 ${CATEGORY_MAXLENGTH}자까지 입력할 수 있습니다.`,
                categoryType === "current"
                    ? categorySelectRef
                    : categoryInputRef
            ) &&
            validateInputLength(
                title,
                TITLE_MAXLENGTH,
                "제목을 입력해주세요",
                `제목 항목은 최대 ${TITLE_MAXLENGTH}자까지 입력할 수 있습니다.`,
                titleInputRef
            ) &&
            validateInputLength(
                choice1,
                CHOICE_MAXLENGTH,
                "선택 1을 입력해주세요",
                `선택 1 항목은 최대 ${CHOICE_MAXLENGTH}자까지 입력할 수 있습니다.`,
                choice1InputRef
            ) &&
            validateInputLength(
                choice2,
                CHOICE_MAXLENGTH,
                "선택 2를 입력해주세요",
                `선택 2 항목은 최대 ${CHOICE_MAXLENGTH}자까지 입력할 수 있습니다.`,
                choice2InputRef
            )
        );
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const categoryName =
            categoryType === "current"
                ? categorySelectProps.value.trim()
                : categoryInputProps.value.trim();
        const title = titleInputProps.value.trim();
        const choice1 = choice1InputProps.value.trim();
        const choice2 = choice2InputProps.value.trim();
        if (!validateInput(categoryName, title, choice1, choice2)) return;
        if (
            categoryType === "new" &&
            categories.find((category) => category.name === categoryName)
        ) {
            alert("해당 카테고리는 이미 있습니다");
            categoryInputRef.current?.focus();
            return;
        }
        const formData = new FormData();
        formData.append("categoryName", categoryName);
        formData.append("title", title);
        formData.append("choice1", choice1);
        formData.append("choice2", choice2);
        choice1Image && formData.append("choice1Image", choice1Image.file);
        choice2Image && formData.append("choice2Image", choice2Image.file);
        formData.append("uploaderId", userObj.uid);
        try {
            onStartUpload();
            const {
                data: { postId },
            } = await authorizedCustomAxios.post<{ postId: number }>(
                "/posts",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            onCompleteUpload();
            navigate(`/detail/${postId}`, { replace: true });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            <Flex
                mt={65}
                flexDir={"column"}
                align={"center"}
                h={"full"}
                w={"90%"}
                mx={"auto"}
                overflow={"auto"}
                gap={20}
                color={textColor}
            >
                <Heading pt={"1em"}>질문 업로드</Heading>
                <FormControl w={"full"}>
                    <FormLabel fontWeight={"bold"} fontSize={"xl"} size={"md"}>
                        1. 카테고리(선택)
                    </FormLabel>
                    <RadioGroup
                        display={"flex"}
                        justifyContent={"space-around"}
                        onChange={handleCategoryRadioChange}
                        value={categoryType}
                        mb={2}
                        p={2}
                        bg={labelBackgroundColor}
                        borderRadius={"md"}
                    >
                        <Radio
                            name="setCategory"
                            value="current"
                            defaultChecked
                        >
                            기존 카테고리
                        </Radio>
                        <Radio name="setCategory" value="new">
                            새 카테고리
                        </Radio>
                    </RadioGroup>
                    {/* 카테고리 불러오기 */}
                    {!isCategoryFetching &&
                    categories.length > 0 &&
                    categoryType === "current" ? (
                        <Select
                            ref={categorySelectRef}
                            name="category"
                            {...categorySelectProps}
                            variant={"filled"}
                        >
                            <option key="all" value="">
                                선택안함
                            </option>
                            {categories.map((filter) => (
                                <option key={filter.id} value={filter.name}>
                                    {filter.name}
                                </option>
                            ))}
                        </Select>
                    ) : (
                        <Input
                            ref={categoryInputRef}
                            type="text"
                            variant={"filled"}
                            {...categoryInputProps}
                            name="newCategory"
                            required
                            maxLength={CATEGORY_MAXLENGTH}
                            autoComplete="off"
                            placeholder="음식 (최대 10자)"
                        />
                    )}
                </FormControl>
                <FormControl>
                    <FormLabel fontWeight={"bold"} fontSize={"xl"} size={"md"}>
                        2. 제목(필수)
                    </FormLabel>
                    <Input
                        ref={titleInputRef}
                        type="text"
                        variant={"filled"}
                        {...titleInputProps}
                        name="question"
                        required
                        maxLength={TITLE_MAXLENGTH}
                        autoComplete="off"
                        placeholder="오늘 점심 뭐 먹지? (최대 20자)"
                    />
                </FormControl>
                {CHOICE_INPUT_LAYOUTS.map((layout) => (
                    <Fragment key={layout.choiceNum}>
                        <FormControl>
                            <FormLabel
                                fontWeight={"bold"}
                                fontSize={"xl"}
                                size={"md"}
                            >
                                {layout.choiceNum * 2 + 1}. 선택
                                {layout.choiceNum} : 이미지(선택)
                            </FormLabel>
                            <FormLabel
                                htmlFor={`AddForm-choice${layout.choiceNum}`}
                                bg={labelBackgroundColor}
                                w={"full"}
                                p={1.5}
                                borderRadius={"md"}
                                cursor={"pointer"}
                            >
                                <Center>이미지 올리기</Center>
                            </FormLabel>
                            <Input
                                display={"none"}
                                ref={layout.imageInputRef}
                                type="file"
                                variant={"filled"}
                                id={`AddForm-choice${layout.choiceNum}`}
                                onChange={(event) =>
                                    handleFileCHange(event, (obj) =>
                                        setChoice1Image(obj)
                                    )
                                }
                                name="choice1Image"
                                accept="image/*"
                            />
                            {layout.choiceImage?.previewUrl && (
                                <Flex
                                    flexDir={"column"}
                                    align={"center"}
                                    gap={8}
                                    pt={4}
                                >
                                    <Image
                                        src={layout.choiceImage.previewUrl}
                                        alt={`choice${layout.choiceNum}Img`}
                                        w={"80%"}
                                    />
                                    <Button
                                        onClick={() =>
                                            clearImageInput(layout.choiceNum)
                                        }
                                        type="reset"
                                        variant={"outline"}
                                        colorScheme="red"
                                    >
                                        CLEAR IMAGE
                                    </Button>
                                </Flex>
                            )}
                        </FormControl>
                        <FormControl>
                            <FormLabel
                                fontWeight={"bold"}
                                fontSize={"xl"}
                                size={"md"}
                            >
                                {layout.choiceNum * 2 + 2}. 선택
                                {layout.choiceNum} : 글(필수)
                            </FormLabel>
                            <Input
                                ref={layout.inputRef}
                                type="text"
                                variant={"filled"}
                                {...layout.inputProps}
                                name="choice1"
                                required
                                maxLength={CHOICE_MAXLENGTH}
                                autoComplete="off"
                                placeholder={`김밥 (최대 ${CHOICE_MAXLENGTH}자)`}
                            />
                        </FormControl>
                    </Fragment>
                ))}
                <Button type="submit" colorScheme={"blue"} boxShadow={"md"}>
                    UPLOAD
                </Button>
            </Flex>
        </form>
    );
};

export default Upload;
