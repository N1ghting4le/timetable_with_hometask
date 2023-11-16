'use client';

import { useState, useEffect, useRef } from "react";
import styles from './weekControlPanel.module.css';
import Loading from "../loading/Loading";

const WeekControlPanel = ({ currWeekIndex, limit, elements, subgroup, setSubgroup, change }) => {
    const [curr, setCurr] = useState(currWeekIndex);
    const [process, setProcess] = useState('loading');
    const ref = useRef(0);

    useEffect(() => {
        const { weekListWrapper, weekList } = elements,
              width = parseFloat(window.getComputedStyle(weekListWrapper).width);

        weekList.style.transform = `translateX(-${curr * width}px)`;
        
        if (process === 'loading') {
            setProcess('idle');
        }
    }, [curr]);

    useEffect(() => {
        if (process === 'idle') {
            elements.weekList.style.display = "";
        }
    }, [process]);

    const applyHeight = () => {
        if (ref.current) {
            elements.weekList.style.height = `${document.querySelector(`#week_${curr}`).getBoundingClientRect().bottom - ref.current.getBoundingClientRect().bottom}px`;
        }
    }

    useEffect(() => {
        window.onload = applyHeight;
    }, []);

    useEffect(applyHeight, [process, curr, change, subgroup]);

    const moveToNext = () => setCurr(curr => curr + 1);
    const moveToPrev = () => setCurr(curr => curr - 1);

    const changeSubgroup = (e) => {
        setSubgroup(+e.target.dataset.subgr);
    }

    const isActive = num => subgroup === num ? {backgroundColor: 'black'} : null;
    
    return process === 'idle' ? (
        <div className={styles.wrapper} ref={el => ref.current = el}>
            {curr === 0 ? null : <button className={`${styles.buttonStyle} ${styles.arrow} ${styles.prev}`} onClick={moveToPrev}>Пред. неделя</button>}
            <div className={styles.buttons}>
                <button className={`${styles.buttonStyle} ${styles.subgrButt}`} data-subgr='0' onClick={changeSubgroup} style={isActive(0)}>Общее</button>
                <button className={`${styles.buttonStyle} ${styles.subgrButt}`} data-subgr='1' onClick={changeSubgroup} style={isActive(1)}>1 Подгруппа</button>
                <button className={`${styles.buttonStyle} ${styles.subgrButt}`} data-subgr='2' onClick={changeSubgroup} style={isActive(2)}>2 Подгруппа</button>
            </div>
            {curr === limit ? null : <button className={`${styles.buttonStyle} ${styles.arrow} ${styles.next}`} onClick={moveToNext}>След. неделя</button>}
        </div>
    ) : <Loading/>;
}

export default WeekControlPanel;