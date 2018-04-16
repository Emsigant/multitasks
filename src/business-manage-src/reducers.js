import {
    combineReducers
} from "redux";
import {
    message
} from "antd";
import {
    STATUS_CODE,
    ACTIONS_CONSTS,
    FAIL_INFOS,
    SUCC_INFOS
} from "./CONSTS";

// message are shown in reducers.js 201804161439
import {
    CommonMessage
} from "./util";

let {
    PENDING,
    INIT,
    REJECTED,
    RESOLVED
} = STATUS_CODE;

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
                CommonMessage(status, 'fetch');
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
                    status: 'init',
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


function Order(state, action) {
    switch (action.type) {
        case ACTIONS_CONSTS.ORDER.ORDER_DATA_STATUS_CHANGE:
            {
                CommonMessage(action.status, 'fetch');
                return {
                    ...state,
                    orderDataStatus: action.status
                }
            }
        case ACTIONS_CONSTS.ORDER.ORDER_DATA:
            {
                return {
                    ...state,
                    orderData: action.data
                }
            }
        case ACTIONS_CONSTS.ORDER.ORDER_DATA_TOTAL:
            {
                return {
                    ...state,
                    orderDataTotal: action.total
                }
            }
        case ACTIONS_CONSTS.ORDER.ORDER_DATA_PAGE_CHANGE:
            {
                return {
                    ...state,
                    orderDataCurrentPage: state.orderDataCurrentPage + action.step
                }
            }
        case ACTIONS_CONSTS.ORDER.ENCASH_DATA:
            {
                return {
                    ...state,
                    encashRecordData: action.data
                }
            }
        case ACTIONS_CONSTS.ORDER.ENCASH_DATA_STATUS:
            {
                CommonMessage(action.status, 'fetch');
                return {
                    ...state,
                    encashRecordDataStatus: action.status
                }
            }
        case ACTIONS_CONSTS.ORDER.ENCASH_DATA_PAGE_CHANGE:
            {
                return {
                    ...state,
                    encashRecordDataCurrentPage: state.encashRecordDataCurrentPage + action.step
                }
            }
        case ACTIONS_CONSTS.ORDER.ORDER_DATA_CLEAR:
            {
                return {
                    ...state,
                    orderData: [],
                    encashRecordData: [],
                }
            }
        default:
            {
                return {
                    orderData: [],
                    orderDataStatus: INIT,
                    orderDataTotal: 50,
                    orderDataCurrentPage: 1,
                    encashRecordData: [],
                    encashRecordDataStatus: INIT,
                    encashRecordDataTotal: 50,
                    encashRecordDataCurrentPage: 1,
                    encashSummary: null,
                    encashSummaryStatus: INIT,
                    encashSubmitStatus: INIT
                }
            }
    }
}

export default combineReducers({
    Certification,
    Account,
    Order
});