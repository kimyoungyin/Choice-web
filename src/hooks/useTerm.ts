export const useTerm = (when: number) => {
    let gap = Date.now() - when;
    let days: number | string = Math.floor(gap / (1000 * 60 * 60 * 24));
    gap -= days * 24 * 60 * 60 * 1000;
    let hours: number | string = Math.floor(gap / (1000 * 60 * 60));
    gap -= hours * 60 * 60 * 1000;
    let minutes: number | string = Math.floor(gap / (1000 * 60));

    days = days < 10 ? "0" + days : days;
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    if (Number(days) !== 0) {
        return `${days}일 전`;
    } else if (Number(hours) !== 0) {
        return `${hours}시간 전`;
    } else {
        return minutes !== "00" ? `${minutes}분 전` : "방금 전";
    }
};
