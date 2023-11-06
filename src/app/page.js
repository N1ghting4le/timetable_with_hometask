import styles from './page.module.css'
import TimetableService from '@/service/TimetableService';
import Button from '@/components/Button';

export default async function Home() {
  const getTimetable = TimetableService();
  const { startDate, endDate, weekList } = await getTimetable();

  return (
    <main className={styles.main}>
      <Button startDateStr={startDate} endDateStr={endDate}/>
    </main>
  )
}
