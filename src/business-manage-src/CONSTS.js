// 状态码 用于dispatch(StatusChange())
export const STATUS_CODE = {
    INIT: 'init',
    RESOLVED: 'resolved',
    REJECTED: 'rejected',
    PENDING: 'pending',
    NOT_EXIST: 'not-exist',
    NOT_LOGIN: 'not-login',
    PSW_WRONG: 'psw-wrong'
};

// 所有API常量
export const APIS = {
    BUSINESS_AUTH_QUERY: '/business/auth/query',
    BUSINESS_AUTH_SUBMIT: '/business/auth',
    MODIFY_PASSWORD: '/business/password/modify',
    ORDER_QUERY: '/business/order/queryList'
};

// fetch的通用配置 fetch(url, { ...otherOptions, ...COMMON_FETCH_OPTIONS })
export const COMMON_FETCH_OPTIONS = {
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json'
    }
};

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
    },
    ORDER: {
        ORDER_DATA: 'ORDER_DATA',
        ORDER_DATA_TOTAL: 'ORDER_TOTAL',
        ORDER_DATA_STATUS_CHANGE: 'ORDER_DATA_STATUS_CHANGE',
        ORDER_DATA_PAGE_CHANGE: 'ORDER_DATA_PAGE_CHANGE',
        ORDER_DATA_CLEAR: 'ORDER_DATA_CLEAR',
        ENCASH_DATA: 'ENCASH_DATA',
        ENCASH_DATA_STATUS: 'ENCASH_DATA_STATUS',
        ENCASH_DATA_PAGE_CHANGE: 'ENCASH_DATA_PAGE_CHANGE'
    }
}

export const FAIL_INFOS = {
    FETCH: '获取信息失败，请重试',
    SUBMIT: '提交失败，请重试',
    UPDATE: '更新失败，请重试',
    DELETE: '删除失败，请重试'
};

export const SUCC_INFOS = {
    FETCH: '成功获取信息',
    SUBMIT: '提交成功',
    UPDATE: '更新成功',
    DELETE: '删除成功'
};