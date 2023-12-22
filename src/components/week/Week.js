'use client';

import { useState, useEffect, useRef, useMemo } from "react";
import Day from "../day/Day";
import styles from "./week.module.css";

const Week = ({ weekIndex, days, curr }) => {
    const [prevCurr, setPrevCurr] = useState(curr);
    const ref = useRef({});
    const transform = useMemo(() => curr > weekIndex ? "translateX(-100%)" : "translateX(100%)", [curr]);

    useEffect(() => {
        ref.current.style.transform = transform;
    }, []);

    useEffect(() => {
        if (curr === weekIndex) {
            setTimeout(() => {
                ref.current.style.transform = "";
            });
            
            ref.current.style.display = "";
        } else if (prevCurr === weekIndex) {
            setTimeout(() => {
                ref.current.style.display = "none";
            }, 300);

            ref.current.style.transform = transform;
        }

        setPrevCurr(curr);
    }, [curr]);

    const renderDays = () => days.map((item, i) => {
        const { date, day, subjects } = item;

        return <Day key={date} date={date} day={day} subjects={subjects} weekIndex={weekIndex} dayIndex={i}/>;
    });

    const elements = renderDays();

    return (
        <div className={styles.week} ref={el => ref.current = el} style={{ display: "none" }}>
            {elements}
        </div>
    );
}

export default Week;