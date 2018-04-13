import {
    STATUS_CODE,
    APIS,
    COMMON_FETCH_OPTIONS
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
const ENV = 'dev';

// business auth actions
export const ACTIONS_CONSTS = {
    // 商家认证
    CER: {
        CER_DATA: 'CER_DATA',
        CER_DATA_STATUS_CHANGE: 'CET_DATA_STATUS_CHANGE',
        CER_SUBMIT: 'CER_SUBMIT',
        CER_SUBMIT_STATUS_CHANGE: 'CER_SUBMIT_STATUS_CHANGE',
        CER_CLEAR: 'CER_CLEAR'
    },
    ACCOUNT: {
        ACCOUNT_SUBMIT_STATUS_CHANGE: 'ACCOUNT_SUBMIT_STATUS_CHANGE'
    }
}
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

// account manage actions
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