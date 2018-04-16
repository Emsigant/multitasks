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

export function FormatTime(timeStamp) {
    timeStamp = +timeStamp;
    let date = new Date(timeStamp);
}