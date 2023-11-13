import TimetableService from '@/service/TimetableService';
import WeekList from '@/components/weekList/WeekList';
import styles from './page.module.css';

export default async function Home() {
  const getTimetable = TimetableService(),
        { weekList, currWeekIndex } = await getTimetable();

  return (
    <main className={styles.main}>
      <WeekList weekList={weekList} currWeekIndex={currWeekIndex}/>
    </main>
  );
}
