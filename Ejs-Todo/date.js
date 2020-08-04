//日期格式化
function getDate() {

    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    let day = new Date().toLocaleDateString("en-US", options);

    return day;
}

module.exports = getDate;



