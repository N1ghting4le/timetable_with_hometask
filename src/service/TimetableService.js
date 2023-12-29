import useHttp from "@/hooks/http.hook";
import { API_URL, SERVER_URL, HEADERS } from "@/env/env";

const TimetableService = () => {
    const request = useHttp();

    const getTimetable = async () => {
        const timetable = await request(API_URL);
        const weekList = await request(`${SERVER_URL}/weekList`, "GET", null, HEADERS);

        return parseTimetable(timetable, weekList);
    }

    const parseTimetable = ({ schedules, startDate, endDate }, listOfWeeks) => {
        const days = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
              date = new Date(),
              currDate = date.getDate(),
              currMonth = date.getMonth(),
              currYear = date.getFullYear(),
              dateStr = `${currDate < 10 ? `0${currDate}` : currDate}.${currMonth + 1 < 10 ? `0${currMonth + 1}` : currMonth + 1}.${currYear}`;
        let currWeekIndex = 0;
        
        const timetable = days.map(item => {
            const day = schedules[item];

            return {
                name: item,
                subjects: day.filter(subj => subj.lessonTypeAbbrev !== 'Консультация' && subj.lessonTypeAbbrev !== 'Экзамен').map(subj => ({
                    auditories: subj.auditories.length ? subj.auditories : [""],
                    startLessonDate: subj.startLessonDate,
                    endLessonDate: subj.endLessonDate,
                    startLessonTime: subj.startLessonTime,
                    endLessonTime: subj.endLessonTime,
                    numSubgroup: subj.numSubgroup,
                    subject: subj.subject,
                    subjectFullName: subj.subjectFullName,
                    type: subj.lessonTypeAbbrev,
                    weekNumber: subj.weekNumber,
                    employees: subj.employees.length ? subj.employees.map(emp => ({
                        firstName: emp.firstName,
                        middleName: emp.middleName,
                        lastName: emp.lastName,
                        photoLink: emp.photoLink
                    })) : [{
                        firstName: "",
                        middleName: "",
                        lastName: "",
                        photoLink: ""
                    }]
                }))
            }
        });

        const weekList = listOfWeeks.map((item, i) => ({
            ...item,
            days: item.days.map(day => {
                if (day.date === dateStr) {
                    currWeekIndex = i;
                }

                if (day.day === 'Воскресенье') return null;

                const dayDate = new Date(day.date.split('.').reverse().join('-')).getTime();
                const weekNum = item.id % 4 || 4;
                const [{subjects: fullDayTimetable}] = timetable.filter(unit => unit.name === day.day);
                const subjects = fullDayTimetable.filter(subj => {
                    const subjStartDate = new Date(subj.startLessonDate.split('.').reverse().join('-')).getTime(),
                          subjEndDate = new Date(subj.endLessonDate.split('.').reverse().join('-')).getTime();

                    return subj.weekNumber && subj.weekNumber.includes(weekNum) && dayDate >= subjStartDate && dayDate <= subjEndDate;
                }).map(subj => {
                    const task = day.hometasks.filter(task => task.subject === subj.subject && (task.subject === 'ИнЯз' ? JSON.stringify(task.teacher) === JSON.stringify(subj.employees[0]) : true) && task.type === subj.type);
                    let hometask = "";

                    if (task.length) {
                        hometask = task[0].text;
                    }

                    return {
                        ...subj,
                        hometask
                    }
                });

                return {
                    date: day.date.substring(0, day.date.lastIndexOf('.')),
                    day: day.day,
                    subjects
                };
            }).filter(day => day && day.subjects.length)
        })).filter(item => item.days.length);

        return {
            startDate,
            endDate,
            currWeekIndex,
            weekList
        };
    }

    return getTimetable;
}

export default TimetableService;