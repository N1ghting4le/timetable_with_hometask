import Subject from "../subject/Subject";
import styles from "./day.module.css";

const Day = ({ date, day, subjects, weekIndex, dayIndex }) => {
    const renderSubjects = () => subjects.map((item, i) => {
        const { auditories, startLessonTime, endLessonTime, numSubgroup, subject, subjectFullName, type, weekNumber, employees, hometask } = item;

        return <Subject key={i}
                        auditory={auditories[0]}
                        start={startLessonTime}
                        end={endLessonTime}
                        subgroup={numSubgroup}
                        subject={subjectFullName}
                        subjShort={subject}
                        type={type}
                        weeks={weekNumber}
                        teacher={employees[0]}
                        hometask={hometask}
                        weekIndex={weekIndex}
                        dayIndex={dayIndex}/>;
    });

    const elements = renderSubjects();

    return (
        <div className={styles.day} style={{borderRadius: dayIndex < 3 ? '30px 0 30px 0' : '0 30px 0 30px'}}>
            <p className={styles.text}>{date}, {day}</p>
            <ul className={styles.subjectList}>
                {elements}
            </ul>
        </div>
    );
}

export default Day;