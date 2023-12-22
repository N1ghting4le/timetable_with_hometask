'use client';

import WeekControlPanel from "../weekControlPanel/WeekControlPanel";
import Week from "../week/Week";
import Loading from "../loading/Loading";
import { useState, useEffect, createContext } from "react";
import styles from "./weekList.module.css";

export const SubgroupContext = createContext(0);

const WeekList = ({ weekList, currWeekIndex }) => {
    const [subgroup, setSubgroup] = useState(0);
    const [curr, setCurr] = useState(currWeekIndex);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => setLoaded(true), []);

    const renderWeeks = () => weekList.map((week, i) => <Week key={i} weekIndex={i} days={week.days} curr={curr}/>);

    const elements = renderWeeks();
    
    return loaded ? (
        <div className={styles.weekWrapper}>
            <WeekControlPanel currWeekIndex={currWeekIndex} 
                              limit={weekList.length - 1}
                              subgroup={subgroup} 
                              setSubgroup={setSubgroup}
                              curr={curr}
                              setCurr={setCurr}/>
            <div className={styles.weeks}>
                <SubgroupContext.Provider value={subgroup}>
                    {elements}
                </SubgroupContext.Provider>
            </div>
        </div>
    ) : <Loading/>;
}

export default WeekList;