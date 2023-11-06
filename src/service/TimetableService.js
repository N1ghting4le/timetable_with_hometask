import useHttp from "@/hooks/http.hook";
import { API_URL, SERVER_URL } from "@/env/env";

const TimetableService = () => {
    const request = useHttp();

    const getTimetable = async () => {
        const timetable = await request(API_URL);
        const weekList = await request(`${SERVER_URL}weekList`);
        const hometaskList = await request(`${SERVER_URL}hometasks`);

        return parseTimetable(timetable, weekList, hometaskList);
    }

    const parseTimetable = ({ schedules, startDate, endDate }, listOfWeeks, hometaskList) => {
        const days = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
        
        const timetable = days.map(item => {
            const day = schedules[item];

            return {
                name: item,
                subjects: day.map(subj => ({
                    auditories: subj.auditories,
                    startLessonTime: subj.startLessonTime,
                    endLessonTime: subj.endLessonTime,
                    numSubgroup: subj.numSubgroup,
                    subject: subj.subject,
                    subjectFullName: subj.subjectFullName,
                    weekNumber: subj.weekNumber,
                    employees: subj.employees.map(emp => ({
                        firstName: emp.firstName,
                        middleName: emp.middleName,
                        lastName: emp.lastName,
                        photoLink: emp.photoLink,
                        degree: emp.degree
                    }))
                }))
            }
        });

        const weekList = listOfWeeks.map(item => ({
            ...item,
            days: item.days.map(day => {
                const weekNum = item.id % 4 || 4;
                const [{subjects: fullDayTimetable}] = timetable.filter(unit => unit.name === day.day);
                const subjects = fullDayTimetable.filter(subj => subj.weekNumber.includes(weekNum)).map(subj => {
                    const [{text: hometask}] = hometaskList.filter(task => task.date === day.date && task.subject === subj.subject && task.teacher === subj.employees[0].lastName);

                    return {
                        ...subj,
                        hometask
                    }
                });

                return {
                    ...day,
                    subjects
                };
            })
        }));

        return {
            startDate,
            endDate,
            weekList
        };
    }

    return getTimetable;
}

export default TimetableService;