'use client';

import TimetableService from "@/service/TimetableService";
import WeekControlPanel from "../weekControlPanel/WeekControlPanel";
import Week from "../week/Week";
import Loading from "../loading/Loading";
import { useState, useEffect, createContext } from "react";
import styles from "./weekList.module.css";

export const SubgroupContext = createContext(0);

const WeekList = () => {
    const [subgroup, setSubgroup] = useState(0);
    const [curr, setCurr] = useState(0);
    const [weekList, setWeekList] = useState([]);
    const getTimetable = TimetableService();

    useEffect(async () => {
        const { weekList, currWeekIndex } = await getTimetable();
        setCurr(currWeekIndex);
        setWeekList(weekList);
    }, []);

    const renderWeeks = () => weekList.map((week, i) => <Week key={i} weekIndex={i} days={week.days} curr={curr}/>);

    const elements = renderWeeks();
    
    return weekList.length ? (
        <div className={styles.weekWrapper}>
            <WeekControlPanel limit={weekList.length - 1}
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