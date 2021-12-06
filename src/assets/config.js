// 上传文件时使用的基础url
var BASE_URL = "http://202.120.117.160:8080";
if (process.env.NODE_ENV == 'development') { BASE_URL = "/api"; }

// 自定义邮箱规则
const checkEmail = (rule, value, callback) => {
    const regEmail = /^\w+@\w+(\.\w+)+$/;
    if (regEmail.test(value)) {
        // 合法邮箱
        return callback();
    }
    callback(new Error("请输入合法的邮箱"));
};

// 自定义手机号规则
const checkMobile = (rule, value, callback) => {
    const regMobile =
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
    if (!value || regMobile.test(value)) {
        return callback();
    }
    // 返回一个错误提示
    callback(new Error("请输入合法的手机号码"));
};


// 计算通过率，返回100中占比
const passingRateCalculate = function (row) {
    return row.submit_times
        ? parseFloat(((row.accept_times / row.submit_times) * 100).toFixed(2))
        : 0;
};

import moment from "moment";
// 计算经过时间
const elapsedTimeCalculate = function (start, end, unit = "hours", fix = 1) {
    const start_time = moment(start);
    const end_time = moment(end);
    return end_time.diff(start_time, unit, true).toFixed(fix);
};

// 格式化展示时间
const formatTime = function (time) {
    return moment(time).format("YYYY-MM-DD HH:mm:ss");
};

// 将空格、换行进行编码，便于前端展示
const SampleDataEncode = function (data) {
    return data.replace(/\n/g, '<br>').replace(/ /g, '&ensp;');
}

export { BASE_URL, checkEmail, checkMobile, passingRateCalculate, elapsedTimeCalculate, formatTime, SampleDataEncode };