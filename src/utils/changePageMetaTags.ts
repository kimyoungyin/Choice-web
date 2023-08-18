const DEFAULT_TITLE = "yyChoice";

const changePageMetaTags = (
    title = DEFAULT_TITLE,
    description = "선택이 고민될 때 yyChoice와 함께하세요!",
    imageUrl = "https://choiceweb.s3.ap-northeast-2.amazonaws.com/public/choiceIcon.svg"
) => {
    document.title =
        title === DEFAULT_TITLE ? DEFAULT_TITLE : `${title} | ${DEFAULT_TITLE}`;
    //set title
    document
        ?.querySelector('meta[property="og:title"]')
        ?.setAttribute(
            "content",
            title === DEFAULT_TITLE
                ? DEFAULT_TITLE
                : `${title} | ${DEFAULT_TITLE}`
        );

    //set description
    document
        ?.querySelector('meta[property="og:description"]')
        ?.setAttribute("content", description);

    //set images
    document
        ?.querySelector('meta[property="og:image"]')
        ?.setAttribute("content", imageUrl);

    //set url
    document
        ?.querySelector('meta[property="og:url"]')
        ?.setAttribute("content", window.location.href);
};

export default changePageMetaTags;
