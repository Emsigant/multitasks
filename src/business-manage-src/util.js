import {
    message
} from "antd";

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
 * @param {string} currentStatus 
 * @param {string} actionType oneof['rejected', 'resolved', 'pending','invalid','init']
 */
export function CommonMessage(currentStatus, actionType) {
    if (currentStatus === 'rejected') {
        message.error(FAIL_INFOS[actionType], 1);
    } else if(currentStatus === 'resolved') {
        message.success(SUCC_INFOS[actionType], 1);
    } else if(currentStatus === 'invalid') {
        message.error('旧密码不正确，请重试', 1);
    }
}