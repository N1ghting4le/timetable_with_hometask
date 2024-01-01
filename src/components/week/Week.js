'use client';

import { useState, useEffect, useRef } from "react";
import Day from "../day/Day";
import styles from "./week.module.css";

const Week = ({ weekIndex, days, curr }) => {
    const [prevCurr, setPrevCurr] = useState(curr);
    const [isCurr, setIsCurr] = useState(curr === weekIndex);
    const [side, setSide] = useState('');
    const ref = useRef({});

    useEffect(() => {
        if (curr === weekIndex) {
            setSide(() => {
                if (prevCurr > weekIndex) return styles.fromLeft;
                return prevCurr < weekIndex ? styles.fromRight : null;
            });
            setIsCurr(true);
        } else if (prevCurr === weekIndex) {
            if (window.innerWidth > 431) {
                setTimeout(() => {
                    setIsCurr(false);
                }, 300);
    
                ref.current.style.transform = curr > weekIndex ? "translateX(-100%)" : "translateX(100%)";
            } else {
                setIsCurr(false);
            }
        }

        setPrevCurr(curr);
    }, [curr]);

    const renderDays = () => days.map((item, i) => {
        const { date, day, subjects } = item;

        return <Day key={date} date={date} day={day} subjects={subjects} weekIndex={weekIndex} dayIndex={i}/>;
    });

    const elements = renderDays();

    return isCurr ? (
        <div className={`${styles.week} ${side}`} ref={el => ref.current = el}>
            {elements}
        </div>
    ) : null;
}

export default Week;