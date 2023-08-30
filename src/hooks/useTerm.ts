export const useTerm = (when: number) => {
    let gap = Date.now() - when;
    const years: number | string = Math.floor(
        gap / (1000 * 60 * 60 * 24 * 30 * 12)
    );
    const months: number = Math.floor(gap / (1000 * 60 * 60 * 24 * 30));
    const days: number = Math.floor(gap / (1000 * 60 * 60 * 24));
    gap -= days * 24 * 60 * 60 * 1000;
    const hours: number = Math.floor(gap / (1000 * 60 * 60));
    gap -= hours * 60 * 60 * 1000;
    const minutes: number = Math.floor(gap / (1000 * 60));

    if (Number(years) !== 0) {
        return `${years}년 전`;
    } else if (Number(months) !== 0) {
        return `${months}개월 전`;
    } else if (Number(days) !== 0) {
        return `${days}일 전`;
    } else if (Number(hours) !== 0) {
        return `${hours}시간 전`;
    } else {
        return minutes !== 0 ? `${minutes}분 전` : "방금 전";
    }
};
