import {
    message
} from "antd";

import {
    STATUS_CODE
} from "./CONSTS";

const FAIL_INFOS = {
    FETCH: '获取失败，请重试',
    SUBMIT: '提交失败，请重试',
    UPDATE: '更新失败，请重试',
    DELETE: '删除失败，请重试'
};
const SUCC_INFOS = {
    FETCH: '获取成功',
    SUBMIT: '提交成功',
    UPDATE: '更新成功',
    DELETE: '删除成功'
};

/**
 * 
 * @param {string} currentStatus oneof['rejected', 'resolved', 'init','pending','invalid']
 * @param {string} actionType oneof['UPDATE', 'SUBMIT', 'FETCH','DELETE']
 */
export function CommonMessage(currentStatus, actionType) {
    switch (currentStatus) {
        case STATUS_CODE.REJECTED:
            {
                message.error(FAIL_INFOS[actionType], 1);
            }
            break;
        case STATUS_CODE.RESOLVED:
            {
                message.success(SUCC_INFOS[actionType], 1);
            }
            break;
        case STATUS_CODE.PSW_WRONG:
            {
                message.error('旧密码不正确，请重试', 1);
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
                message.error('未登录，请先登录', 1);
            }
            break;
        case STATUS_CODE.NOT_EXIST:
            {
                message.error('用户不存在，请重试', 1);
            }
            break;
        default:
            {
                throw new Error('Unknown status');
            }
    }
}