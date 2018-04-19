// 状态码 用于dispatch(StatusChange())
export const STATUS_CODE = {
    INIT: 'init',
    RESOLVED: 'resolved',
    REJECTED: 'rejected',
    PENDING: 'pending',
    NOT_EXIST: 'not-exist',
    NOT_LOGIN: 'not-login',
    PSW_WRONG: 'psw-wrong',
};

// 所有API常量
export const APIS = {
    BUSINESS_AUTH_QUERY: '/business/auth/query',
    BUSINESS_AUTH_SUBMIT: '/business/auth',
    MODIFY_PASSWORD: '/business/password/modify',
    ORDER_QUERY: '/business/order/queryList',
    ENCASH_RECORD_QUERY: '/business/withdraw/queryList',
    ENCASH_SUBMIT_WITHDRAW: '/business/withdraw',
    INCOME_DATA_QUERY: '/business/revenue',
};

// fetch的通用配置 fetch(url, { ...otherOptions, ...COMMON_FETCH_OPTIONS })
export const COMMON_FETCH_OPTIONS = {
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
    },
};

// actions consts
export const ACTIONS_CONSTS = {
    CER: {
        CER_DATA: '1',
        CER_DATA_STATUS_CHANGE: '2',
        CER_SUBMIT: '3',
        CER_SUBMIT_STATUS_CHANGE: '4',
        CER_CLEAR: '5',
    },
    ACCOUNT: {
        ACCOUNT_SUBMIT_STATUS_CHANGE: '6',
    },
    ORDER: {
        // order-data
        ORDER_DATA: '7',
        ORDER_DATA_TOTAL: '8',
        ORDER_DATA_STATUS_CHANGE: '9',
        ORDER_DATA_PAGE_CHANGE: '10',
        ORDER_DATA_CLEAR: '11',
        // encash-record
        ENCASH_DATA: '12',
        ENCASH_TOTAL: '13',
        ENCASH_DATA_STATUS: '14',
        ENCASH_DATA_PAGE_CHANGE: '15',
        ENCASH_SUBMIT_STATUS: '16',
        INCOME_DATA: '17',
        INCOME_DATA_FETCH_STATUS: '18',
    }
}

export const FAIL_INFOS = {
    FETCH: '获取信息失败，请重试',
    SUBMIT: '提交失败，请重试',
    UPDATE: '更新失败，请重试',
    DELETE: '删除失败，请重试',
};

export const SUCC_INFOS = {
    FETCH: '成功获取信息',
    SUBMIT: '提交成功',
    UPDATE: '更新成功',
    DELETE: '删除成功',
};

export const mapTitleToKeyInOrder = {
    '地址': 'address',
    '总金额': 'orderTotalAmount',
    '演出名称': 'showName',
    '演出开始时间': 'startTime',
    '状态': 'status',
    '类型名称': 'typeName',
    '提现金额': 'amount',
    '提现时间': 'updateTime',
    '提现银行卡号': 'bankCardNo',
    '收款人': 'bankName',
    '提现状态': 'status',
};