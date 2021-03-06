import {
    message
} from "antd";

import {
    STATUS_CODE,
    FAIL_INFOS,
    SUCC_INFOS
} from "./CONSTS";

/**
 * 
 * @param {string} currentStatus oneof['rejected', 'resolved', 'init','pending','invalid']
 * @param {string} actionType oneof['UPDATE', 'SUBMIT', 'FETCH','DELETE']
 */
export function CommonMessage(currentStatus, actionType) {
    actionType = actionType.toUpperCase();
    switch (currentStatus) {
        case STATUS_CODE.REJECTED:
            {
                message.error(FAIL_INFOS[actionType], .5);
            }
            break;
        case STATUS_CODE.RESOLVED:
            {
                message.success(SUCC_INFOS[actionType], .5);
            }
            break;
        case STATUS_CODE.PSW_WRONG:
            {
                message.error('旧密码不正确，请重试', .5);
            }
            break;
        case STATUS_CODE.INIT:
            {

            }
            break;
        case STATUS_CODE.PENDING:
            {

            }
            break;
        case STATUS_CODE.NOT_LOGIN:
            {
                message.error('未登录，请先登录', .5);
            }
            break;
        case STATUS_CODE.NOT_EXIST:
            {
                message.error('用户不存在，请重试', .5);
            }
            break;
        default:
            {
                throw new Error('Unknown status');
            }
    }
}

/**
 * 
 * @param {number} num 
 * @returns {string}
 */
function formatNumberToString(num) {
    return +num < 10 ? '0' + num : '' + num;
}

/**
 * 
 * @param {number} timeStamp
 * @returns {string}
 */
export function FormatTime(timeStamp) {
    timeStamp = +timeStamp;
    let date = new Date(timeStamp);
    let getFullYear = date.getFullYear(),
        getMonth = date.getMonth() + 1,
        getDate = date.getDate(),
        getHours = date.getHours(),
        getMinutes = date.getMinutes();
    getMonth = formatNumberToString(getMonth);
    getDate = formatNumberToString(getDate);
    getHours = formatNumberToString(getHours);
    getMinutes = formatNumberToString(getMinutes);
    return `${getFullYear}-${getMonth}-${getDate} ${getHours}:${getMinutes}`;
}