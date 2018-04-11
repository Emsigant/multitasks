// mode: dev or prod
const ENV = 'dev'; 

// common fetch options
const COMMON_FETCH_OPTIONS = {
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json'
    }
};

// apis
const APIS = {
    BUSINESS_AUTH_QUERY: '/business/auth/query',
    BUSINESS_AUTH_SUBMIT:'/business/auth'
};

// business auth actions
export const ACTIONS_CONSTS = {
    // 商家认证
    CER: {
        CER_DATA: 'CER_DATA',
        CER_DATA_STATUS_CHANGE: 'CET_DATA_STATUS_CHANGE',
        CER_SUBMIT: 'CER_SUBMIT',
        CER_SUBMIT_STATUS_CHANGE: 'CER_SUBMIT_STATUS_CHANGE',
        CER_CLEAR: 'CER_CLEAR'
    }
}
export function CerData(data) {
    return {
        type: ACTIONS_CONSTS.CER.CER_DATA,
        data
    }
}
export function CerStatus(status) {
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
export function CerFetchData() {
    return (dispatch, getState) => {
        dispatch(CerStatus('pending'));
        dispatch(CerClear());
        if (ENV === 'dev') {
            setTimeout(() => {
                let random = Math.random();
                if (random > 0) {
                    dispatch(CerData({
                        userId: '000001',
                        userName: 'a business',
                        bankCardNo:'10342948292',
                        bankName:'bankaccountname',
                        authImageUrl: 'some value',
                        status: '2'
                    }));
                    dispatch(CerStatus('resolved'));
                } else {
                    dispatch(CerData('this is a fail message, random=' + random));
                    dispatch(CerStatus('rejected'));
                }
            }, 500);
        } else {
            fetch(APIS.BUSINESS_AUTH_QUERY, {
                    method: 'post',
                    ...COMMON_FETCH_OPTIONS
                })
                .then(resp => resp.json())
                .then(resp => {
                    // success
                    let data = resp.content.dataList[0];
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }
}