const generateDate = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = ("0" + (now.getMonth() + 1)).slice(-2);
    const day = ("0" + now.getDate()).slice(-2);

    const hour = ("0" + now.getHours()).slice(-2);
    const minute = ("0" + now.getMinutes()).slice(-2);
    const second = ("0" + now.getSeconds()).slice(-2);

    return {
        year : year,
        month : month,
        day : day,
        hour : hour,
        minute : minute,
        second : second
    }
}

const getDateTime = () => {
    const { year, month, day, hour, minute, second } = generateDate();
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

const getDate = () => {
    const { year, month, day } = generateDate();
    return `${year}-${month}-${day}`;
}

const getTime = () => {
    const { hour, minute, second } = generateDate();
    return `${hour}:${minute}:${second}`;
}

module.exports = { getDateTime, getDate, getTime };