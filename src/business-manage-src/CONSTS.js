// 状态码 用于dispatch(StatusChange())
export const STATUS_CODE = {
    INIT:'init',
    RESOLVED:'resolved',
    REJECTED:'rejected',
    PENDING:'pending',
    NOT_EXIST:'not-exist',
    NOT_LOGIN:'not-login',
    PSW_WRONG:'psw-wrong'
};

// 所有API常量
export const APIS = {
    BUSINESS_AUTH_QUERY: '/business/auth/query',
    BUSINESS_AUTH_SUBMIT: '/business/auth',
    MODIFY_PASSWORD: '/business/password/modify'
};

// fetch的通用配置 fetch(url, { ...otherOptions, ...COMMON_FETCH_OPTIONS })
const COMMON_FETCH_OPTIONS = {
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json'
    }
};

