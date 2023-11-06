'use client';

import useHttp from "@/hooks/http.hook";
import { useState, useEffect, useMemo } from "react";
import { SERVER_URL } from "@/env/env";

const Button = ({ startDateStr, endDateStr }) => {
    const [disabled, setDisabled] = useState(true);
    const [weekAmount, setWeekAmount] = useState(0);
    const [hometaskAmount, setHometaskAmount] = useState(0);
    const request = useHttp();
    const startDateArr = useMemo(() => startDateStr.split('.').map((item, i) => i === 1 ? +item - 1 : +item), [startDateStr]);
    const endDateArr = useMemo(() => endDateStr.split('.').map((item, i) => i === 1 ? +item - 1 : +item), [endDateStr]);

    useEffect(() => {
        (async () => {
            await getAmount(setWeekAmount, "weekList");
            await getAmount(setHometaskAmount, "hometasks");

            setDisabled(false);
        })();
    }, []);

    const getAmount = async (setAmount, path) => {
        await request(`${SERVER_URL}${path}`)
                .then(res => {
                    setAmount(res.length);
                })
                .catch(err => {
                    console.error(err);
                });
    }

    const deleteData = async (amount, path) => {
        for (let i = 1; i <= amount; i++) {
            await request(`${SERVER_URL}${path}/${i}`, "DELETE");
        }
    }

    const reset = async () => {
        setDisabled(true);

        await deleteData(weekAmount, "weekList");
        await deleteData(hometaskAmount, "hometasks");

        let [date, month, year] = startDateArr;
        let currDate = date, currMonth = month, currWeek = 1;
        let weeklyDayList = [];

        const amountOfDaysInMonths = {
            0: 31,
            1: year % 4 === 0 ? 29 : 28,
            2: 31,
            3: 30,
            4: 31,
            5: 30,
            6: 31,
            7: 31,
            8: 30,
            9: 31,
            10: 30,
            11: 31
        };

        const checkLastDayOfMonth = () => {
            if (currDate === amountOfDaysInMonths[currMonth]) {
                currMonth++;
                currDate = 1;
            } else {
                currDate++;
            }
        }

        const sendWeek = async () => {
            const body = {
                id: currWeek,
                days: weeklyDayList
            };
            
            await request(`${SERVER_URL}weekList`, "POST", JSON.stringify(body));
        }

        const parseDay = (day) => {
            switch (day) {
                case 1: return "Понедельник";
                case 2: return "Вторник";
                case 3: return "Среда";
                case 4: return "Четверг";
                case 5: return "Пятница";
                case 6: return "Суббота";
            }
        }
        
        const startDate = new Date(year, month, date);

        [date, month, year] = endDateArr;

        const endDate = new Date(year, month, date);
        const dayAmount = (endDate - startDate) / 86400000 + 1;

        for (let i = 0; i < dayAmount; i++) {
            const currDay = new Date(year, currMonth, currDate).getDay();

            if (currDay === 0) {
                await sendWeek();

                weeklyDayList = [];
                currWeek++;

                checkLastDayOfMonth();

                continue;
            }

            weeklyDayList.push({
                date: `${currDate < 10 ? `0${currDate}` : currDate}.${currMonth + 1 < 10 ? `0${currMonth + 1}` : currMonth + 1}`,
                day: parseDay(currDay)
            });

            checkLastDayOfMonth();
        }
        
        if (weeklyDayList.length > 0) {
            await sendWeek();
            setWeekAmount(currWeek);
        } else {
            setWeekAmount(currWeek - 1);
        }

        setDisabled(false);
    }

    return <button disabled={disabled} onClick={reset}>Сброс</button>
}

export default Button;