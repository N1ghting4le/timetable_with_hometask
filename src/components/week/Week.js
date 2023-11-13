import Day from "../day/Day";
import styles from "./week.module.css";

const Week = ({ weekIndex, days }) => {
    const renderDays = () => days.map((item, i) => {
        const { date, day, subjects } = item;

        return <Day key={date} date={date} day={day} subjects={subjects} weekIndex={weekIndex} dayIndex={i}/>;
    });

    const elements = renderDays();

    return (
        <div className={styles.week} id={`week_${weekIndex}`}>
            {elements}
        </div>
    );
}

export default Week;