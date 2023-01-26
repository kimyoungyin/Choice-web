import { Category } from "components/AddForm";
import { useHistory } from "react-router";
import "../style.css";

interface ContentProps {
    item: {
        id: number;
        title: string;
        choice1: string;
        choice2: string;
        category: Category;
        createdAt: string;
    };
}

const Content = ({ item }: ContentProps) => {
    const history = useHistory();
    // const toggleChoiceMode = () => {
    //     const homeList = document.querySelector(".Home-list");
    // };

    const goToChoiceInfo = () => {
        history.push(`/detail/${item.id}`);
    };

    const term = (now: number, when: number) => {
        let gap = now - when;
        let days: number | string = Math.floor(gap / (1000 * 60 * 60 * 24));
        gap -= days * 24 * 60 * 60 * 1000;
        let hours: number | string = Math.floor(gap / (1000 * 60 * 60));
        gap -= hours * 60 * 60 * 1000;
        let minutes: number | string = Math.floor(gap / (1000 * 60));

        days = days < 10 ? "0" + days : days;
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;

        if (Number(days) !== 0) {
            return `${days}일 ${hours}시간 ${minutes}분 전`;
        } else if (Number(hours) !== 0) {
            return `${hours}시간 ${minutes}분 전`;
        } else {
            return minutes !== "00" ? `${minutes}분 전` : "방금 전";
        }
    };
    return (
        <section className="Content" onClick={goToChoiceInfo}>
            <div className="Content-texts">
                <div className="Content-question">{item.title}</div>
                <div className="Content-choices">
                    {item.choice1}
                    <span className="Content-VS">vs</span> {item.choice2}
                </div>
            </div>
            {item.category && (
                <div className="Content-category">{item.category.name}</div>
            )}
            <div className="Content-when">
                {term(Date.now(), Date.parse(item.createdAt))}
            </div>
        </section>
    );
};

export default Content;
