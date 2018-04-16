import {
    STATUS_CODE,
    APIS,
    COMMON_FETCH_OPTIONS,
    ACTIONS_CONSTS
} from "./CONSTS";

let {
    REJECTED,
    RESOLVED,
    PSW_WRONG,
    NOT_EXIST,
    NOT_LOGIN,
    PENDING,
    INIT
} = STATUS_CODE;

// mode: dev or prod
const ENV = 'prod';

// certification module
export function CerData(data) {
    return {
        type: ACTIONS_CONSTS.CER.CER_DATA,
        data
    }
}
export function CerDataStatus(status) {
    return {
        type: ACTIONS_CONSTS.CER.CER_DATA_STATUS_CHANGE,
        status
    }
}
export function CerClear() {
    return {
        type: ACTIONS_CONSTS.CER.CER_CLEAR
    }
}
export function CerFetchData(fakeData) {
    return (dispatch, getState) => {
        dispatch(CerDataStatus('pending'));
        dispatch(CerClear());
        if (ENV === 'dev') {
            setTimeout(() => {
                let random = Math.random();
                if (random > 0) {
                    dispatch(CerData({
                        ...fakeData
                    }));
                    dispatch(CerDataStatus(RESOLVED));
                } else {
                    dispatch(CerData('this is a fail message, random=' + random));
                    dispatch(CerDataStatus(REJECTED));
                }
            }, 500);
        } else if (ENV === 'prod') {
            fetch(APIS.BUSINESS_AUTH_QUERY, {
                    method: 'post',
                    ...COMMON_FETCH_OPTIONS
                })
                .then(resp => resp.json())
                .then(resp => {
                    // success
                    if (resp.code === '1') {
                        let data = resp.content;
                        dispatch(CerData(data));
                        dispatch(CerDataStatus(RESOLVED));
                    } else {
                        dispatch(CerDataStatus(REJECTED))
                    }
                })
                .catch(err => {
                    dispatch(CerDataStatus(REJECTED))
                });
        }
    }
}
export function CerSubmitStatusChange(status) {
    return {
        type: ACTIONS_CONSTS.CER.CER_SUBMIT_STATUS_CHANGE,
        status
    }
}
export function CerSubmit(data) {
    return (dispatch, getState) => {
        dispatch(CerSubmitStatusChange(PENDING));
        if (ENV === 'dev') {
            setTimeout(() => {
                dispatch(CerSubmitStatusChange(RESOLVED));
                dispatch(CerFetchData({
                    userId: '000001',
                    userName: 'a business',
                    bankCardNo: '10342948292',
                    bankName: 'bankaccountname',
                    authImageUrl: 'some value',
                    status: '0'
                }));
            }, 500);
        } else if (ENV === 'prod') {
            fetch(APIS.BUSINESS_AUTH_SUBMIT, {
                    method: 'post',
                    body: JSON.stringify(data),
                    ...COMMON_FETCH_OPTIONS
                })
                .then(resp => resp.json())
                .then(resp => {
                    if (resp.code === '1') {
                        dispatch(CerSubmitStatusChange(RESOLVED));
                        dispatch(CerFetchData());
                    } else {
                        dispatch(CerSubmitStatusChange(REJECTED));
                    }
                })
                .catch(err => {
                    dispatch(CerSubmitStatusChange(REJECTED));
                });
        }
    }
}

// account manage module
// account submit status: pending, resolved, rejected, invalid
export function AccountSubmitStatusChange(status) {
    return {
        type: ACTIONS_CONSTS.ACCOUNT.ACCOUNT_SUBMIT_STATUS_CHANGE,
        status
    }
}
export function AccountSubmit(data) {
    return (dispatch, getState) => {
        dispatch(AccountSubmitStatusChange(PENDING));
        if (ENV === 'dev') {
            setTimeout(() => {
                dispatch(AccountSubmitStatusChange(RESOLVED));
            }, 500);
        } else if (ENV === 'prod') {
            fetch(APIS.MODIFY_PASSWORD, {
                    method: 'post',
                    body: JSON.stringify(data),
                    ...COMMON_FETCH_OPTIONS
                })
                .then(resp => resp.json())
                .then(resp => {
                    let code = resp.code;
                    switch (code) {
                        case '1':
                            {
                                dispatch(AccountSubmitStatusChange(RESOLVED));
                            }
                            break;
                        case '3':
                            {
                                dispatch(AccountSubmitStatusChange(NOT_LOGIN));
                            }
                            break;
                        case '10000':
                            {
                                dispatch(AccountSubmitStatusChange(NOT_EXIST));
                            }
                            break;
                        case '10001':
                            {
                                dispatch(AccountSubmitStatusChange(PSW_WRONG));
                            }
                            break;
                        default:
                            {
                                dispatch(AccountSubmitStatusChange(REJECTED));
                            }
                    }
                })
                .catch(err => {
                    dispatch(AccountSubmitStatusChange(REJECTED))
                })
        }
    }
}

// order module
// order data
function OrderData(data) {
    return {
        type: ACTIONS_CONSTS.ORDER.ORDER_DATA,
        data
    }
}

function OrderTotal(total) {
    return {
        type: ACTIONS_CONSTS.ORDER.ORDER_DATA_TOTAL,
        total
    }
}

function OrderDataStatusChange(status) {
    return {
        type: ACTIONS_CONSTS.ORDER.ORDER_DATA_STATUS_CHANGE,
        status
    }
}

let fakeOrderData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item => {
    return {
        key: item,
        "address": "121",
        "orderTotalAmount": 1,
        "showName": "1",
        "startTime": 1523239778000,
        "status": "1",
        "typeName": "1"
    }
});

export function FetchOrderData(pageNo = 1, pageSize = 10) {
    return (dispatch, getState) => {
        dispatch(OrderDataStatusChange(PENDING));
        if (ENV === 'dev') {
            setTimeout(() => {
                dispatch(OrderDataStatusChange(RESOLVED));
                dispatch(OrderData(fakeOrderData));
            }, 500);
        } else if (ENV === 'prod') {
            fetch(APIS.ORDER_QUERY, {
                    body: JSON.stringify({
                        pageNo,
                        pageSize
                    }),
                    method: 'post',
                    ...COMMON_FETCH_OPTIONS
                })
                .then(res => res.json())
                .then(res => {
                    if (res.code === '1') {
                        dispatch(OrderDataStatusChange(RESOLVED));
                        dispatch(OrderData(res.content.dataList));
                        dispatch(OrderTotal(res.totalCount));
                    } else {
                        dispatch(OrderDataStatusChange(REJECTED));
                    }
                })
                .catch(err => {
                    dispatch(OrderDataStatusChange(REJECTED));
                })
        }
    }
}
// encash record data
function EncashRecordData(data) {
    return {
        type: ACTIONS_CONSTS.ORDER.ENCASH_DATA,
        data
    }
}

function EncashRecordDataStatusChange(status) {
    return {
        type: ACTIONS_CONSTS.ORDER.ENCASH_DATA_STATUS,
        status
    }
}
export function FetchEncashRecordData() {
    return (dispatch, getState) => {
        dispatch(EncashRecordDataStatusChange(PENDING));
        if (ENV === 'dev') {
            setTimeout(() => {
                dispatch(EncashRecordDataStatusChange(RESOLVED));
                dispatch(EncashRecordData(
                    [1, 2, 3, 4, 5]
                ))
            }, 500);
        } else if (ENV === 'prod') {

        }
    }
}

// clear order data
export function OrderDataClear() {
    return {
        type: ACTIONS_CONSTS.ORDER.ORDER_DATA_CLEAR
    }
}
export function OrderPageChange(type) {
    switch (type) {
        case 'order-data':
            {
                return (step) => ({
                    type: ACTIONS_CONSTS.ORDER.ORDER_DATA_PAGE_CHANGE,
                    step
                })
            }
            break;
        case 'encash-record':
            {
                return (step) => ({
                    type: ACTIONS_CONSTS.ORDER.ENCASH_DATA_PAGE_CHANGE,
                    step
                })
            }
            break;
        default:
            break;
    }
}