'use client';

import WeekControlPanel from "../weekControlPanel/WeekControlPanel";
import Week from "../week/Week";
import { useRef, useState, createContext } from "react";
import styles from "./weekList.module.css";

export const SubgroupContext = createContext(0);
export const ChangeContext = createContext(() => {});

const WeekList = ({ weekList, currWeekIndex }) => {
    const [subgroup, setSubgroup] = useState(0);
    const [change, setChange] = useState(true);
    const ref = useRef({});

    const renderWeeks = () => weekList.map((week, i) => <Week key={i} weekIndex={i} days={week.days}/>);

    const elements = renderWeeks();
    
    return (
        <div className={styles.weekWrapper} ref={el => ref.current.weekListWrapper = el}>
            <WeekControlPanel currWeekIndex={currWeekIndex} 
                              limit={weekList.length - 1} 
                              elements={ref.current} 
                              subgroup={subgroup} 
                              setSubgroup={setSubgroup} 
                              change={change}/>
            <div className={styles.weeks} 
                 ref={el => ref.current.weekList = el} 
                 style={{width: `${100 * weekList.length}%`, display: "none"}}>
                <SubgroupContext.Provider value={subgroup}>
                    <ChangeContext.Provider value={setChange}>
                        {elements}
                    </ChangeContext.Provider>
                </SubgroupContext.Provider>
            </div>
        </div>
    );
}

export default WeekList;