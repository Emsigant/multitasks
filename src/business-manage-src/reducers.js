import {
    combineReducers
} from "redux";
import {
    ACTIONS_CONSTS
} from "./actions";
import {
    message
} from "antd";

// infos
const FAIL_INFOS = {
    FETCH: '获取信息失败，请重试',
    SUBMIT: '提交失败，请重试',
    UPDATE: '更新失败，请重试',
    DELETE: '删除失败，请重试'
};
const SUCC_INFOS = {
    FETCH: '成功获取信息',
    SUBMIT: '提交成功',
    UPDATE: '更新成功',
    DELETE: '删除成功'
};

function Certification(state, action) {
    switch (action.type) {
        case ACTIONS_CONSTS.CER.CER_DATA:
            {
                return {
                    ...state,
                    data: action.data
                }
            }
        case ACTIONS_CONSTS.CER.CER_DATA_STATUS_CHANGE:
            {
                let status = action.status;
                if (status === 'rejected') {
                    message.error(FAIL_INFOS.FETCH, 1);
                    return {
                        ...state,
                        status,
                        msg: FAIL_INFOS.FETCH
                    }
                } else if (status === 'resolved') {
                    message.success(SUCC_INFOS.FETCH, 1);

                } else if (status === 'pending') {

                }
                return {
                    ...state,
                    status
                }
            }
        case ACTIONS_CONSTS.CER.CER_CLEAR:
            {
                return {
                    ...state,
                    data: [],
                    msg: ''
                }
            }
        case ACTIONS_CONSTS.CER.CER_SUBMIT_STATUS_CHANGE:
            {
                let status = action.status;
                if (status === 'rejected') {
                    message.error(FAIL_INFOS.SUBMIT, 1);
                    return {
                        ...state,
                        submitStatus: status,
                        msg: FAIL_INFOS.FETCH
                    }
                } else if (status === 'resolved') {
                    message.success(SUCC_INFOS.SUBMIT, 1);

                } else if (status === 'pending') {

                }
                return {
                    ...state,
                    submitStatus: status,
                }
            }
        default:
            {
                return {
                    status: 'pending',
                    msg: '',
                    data: null,
                    submitStatus: 'init'
                }
            }
    }
}

function Account(state, action) {
    switch (action.type) {
        case ACTIONS_CONSTS.ACCOUNT.ACCOUNT_SUBMIT_STATUS_CHANGE:
            {
                let status = action.status;
                return {
                    submitStatus: action.status
                }
            }
        default:
            {
                return {
                    submitStatus: 'init'
                }
            }
    }
}

export default combineReducers({
    Certification,
    Account
});