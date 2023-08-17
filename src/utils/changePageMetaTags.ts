const DEFAULT_TITLE = "yyChoice";

const changePageMetaTags = (title = DEFAULT_TITLE) => {
    document.title =
        title === DEFAULT_TITLE ? DEFAULT_TITLE : `${title} | ${DEFAULT_TITLE}`;
    // //set title
    // document
    //     ?.querySelector('meta[property="og:title"]')
    //     ?.setAttribute(
    //         "content",
    //         title === DEFAULT_TITLE
    //             ? DEFAULT_TITLE
    //             : `${title} | ${DEFAULT_TITLE}`
    //     );

    // //set description
    // document
    //     ?.querySelector('meta[property="og:description"]')
    //     ?.setAttribute("content", description);

    // //set images
    // document
    //     ?.querySelector('meta[property="og:image"]')
    //     ?.setAttribute("content", imageUrl);

    // //set url
    // document
    //     ?.querySelector('meta[property="og:url"]')
    //     ?.setAttribute("content", window.location.href);
};

export default changePageMetaTags;
