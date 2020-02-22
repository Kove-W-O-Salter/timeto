let time_to = document.getElementById("time_to");
let button = document.getElementById("compute");
let day = document.getElementById("day");
let month = document.getElementById("month");
let year = document.getElementById("year");
let hour = document.getElementById("hour");
let minute = document.getElementById("minute");
let current_date = new Date();
let timeout_worker = new Worker("timeout_worker.js");

year.value = current_date.getFullYear();
month.value = current_date.getMonth() + 1;
day.value = current_date.getDate();
hour.value = current_date.getHours();
minute.value = current_date.getMinutes();

const days = [
    31,
    28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31
];

function date_diff(date_x, date_y) {
    return {
        year: date_x.getFullYear() - date_y.getFullYear(),
        month: date_x.getMonth() - date_y.getMonth(),
        day: date_x.getDate() - date_y.getDate(),
        hour: date_x.getHours() - date_y.getHours(),
        minute: date_x.getMinutes() - date_y.getMinutes(),
        second: date_x.getSeconds() - date_y.getSeconds()
    }
}

function get_time_to(date) {
    let now = new Date();
    let diff = date_diff(date, now);

    diff.year *= (365 * 24 * 60);
    diff.month = (days[(now.getMonth() + diff.month)] * diff.month * 24 * 60);
    diff.day *= (24 * 60);
    diff.hour *= 60;
    
    if(diff.second >= 30) {
        diff.minute += 1;
    } else if(diff.second <= -30) {
        diff.minute -= 1;
    }

    return diff.year + diff.month + diff.day + diff.hour + diff.minute;
}

function format(number) {
    let string = number.toString().split("").reverse();
    let result = [];

    for(let x = 0; x < string.length; x ++) {
        if(((x % 3) === 0) && (x !== 0)) {
            result.push(",")
        }
        result.push(string[x]);
    }

    result.reverse();
    result.push(" min")

    return result.join("");
}

timeout_worker.onmessage = (event) => {
    if(event.data === "update") {
        time_to.innerHTML = format(get_time_to(current_date));
        timeout_worker.postMessage("start");
    }
};

button.addEventListener("click", (event) => {
    if((day.value !== "") && (month.value !== "") && (year.value !== "") && (hour.value !== "") && (minute.value !== "")) {
        current_date.setFullYear(parseInt(year.value));
        current_date.setMonth(parseInt(month.value) - 1);
        current_date.setDate(parseInt(day.value));
        current_date.setHours(parseInt(hour.value));
        current_date.setMinutes(parseInt(minute.value));

        console.table(current_date);

        timeout_worker.postMessage("start");
    }
})