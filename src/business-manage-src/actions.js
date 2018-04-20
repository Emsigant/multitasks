import {
    STATUS_CODE,
    APIS,
    COMMON_FETCH_OPTIONS,
    ACTIONS_CONSTS
} from "./CONSTS";
import {
    FormatTime
} from "./util";
import image from '../r4.jpg';
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
        "orderId": 'wi' + item,
        "address": "121",
        "orderTotalAmount": 1,
        "showName": "1",
        "startTime": "1523239778000",
        "status": "1",
        "typeName": "1"
    }
});
let mapOrderCodeToStatus = {
    '0': '未付款',
    '1': '已付款',
    '2': '已出票',
    '3': '未付款已过期',
    '4': '取消交易'
};
export function FetchOrderData(pageNo = 1, pageSize = 10) {
    return (dispatch, getState) => {
        dispatch(OrderDataStatusChange(PENDING));
        if (ENV === 'dev') {
            setTimeout(() => {
                dispatch(OrderDataStatusChange(RESOLVED));
                dispatch(OrderData(fakeOrderData.map(item => ({
                    ...item,
                    startTime: FormatTime(item.startTime),
                    status: mapOrderCodeToStatus[item.status],
                    orderTotalAmount: +item.orderTotalAmount / 100
                }))));
                dispatch(OrderTotal(100));
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
                        let dataList = res.content.dataList;
                        dispatch(OrderData(
                            dataList.map(item => ({
                                ...item,
                                startTime: FormatTime(item.startTime),
                                status: mapOrderCodeToStatus[item.status],
                                orderTotalAmount: +item.orderTotalAmount / 100
                            }))
                        ));
                        dispatch(OrderTotal(res.content.totalCount));
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

function EncashTotal(total) {
    return {
        type: ACTIONS_CONSTS.ORDER.ENCASH_TOTAL,
        total
    }
}

function EncashRecordDataStatusChange(status) {
    return {
        type: ACTIONS_CONSTS.ORDER.ENCASH_DATA_STATUS,
        status
    }
}
let fakeEncashData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item => ({
    "withdrawOrderId": 'woid' + item,
    "bankCardNo": "10086",
    "bankName": "于北川",
    "amount": 9978,
    "updateTime": 1563867194000,
    "status": "0",
}));
let mapCodeToEncashStatus = {
    '0': '提现中',
    '1': '提现成功',
    '2': '提现失败',
}
export function FetchEncashRecordData(pageNo = 1, pageSize = 10) {
    return (dispatch, getState) => {
        dispatch(EncashRecordDataStatusChange(PENDING));
        if (ENV === 'dev') {
            setTimeout(() => {
                dispatch(EncashRecordDataStatusChange(RESOLVED));
                dispatch(EncashRecordData(
                    fakeEncashData.map(item => ({
                        ...item,
                        status: mapCodeToEncashStatus[item.status],
                        updateTime: FormatTime(item.updateTime)
                    }))
                ));
                dispatch(EncashTotal(100));
            }, 500);
        } else if (ENV === 'prod') {
            fetch(APIS.ENCASH_RECORD_QUERY, {
                    method: 'post',
                    body: JSON.stringify({
                        pageNo,
                        pageSize
                    }),
                    ...COMMON_FETCH_OPTIONS
                })
                .then(res => res.json())
                .then(res => {
                    if (res.code === '1') {
                        dispatch(EncashRecordDataStatusChange(RESOLVED));
                        let data = res.content.dataList;
                        dispatch(EncashRecordData(data.map(item => ({
                            ...item,
                            status: mapCodeToEncashStatus[item.status],
                            updateTime: FormatTime(item.updateTime)
                        }))));
                        dispatch(EncashTotal(res.content.totalCount));
                    } else {
                        dispatch(EncashRecordDataStatusChange(REJECTED));
                    }
                })
                .catch(err => {
                    dispatch(EncashRecordDataStatusChange(REJECTED));
                    console.log(err);
                })
        }
    }
}

// clear order data
export function OrderDataClear() {
    return {
        type: ACTIONS_CONSTS.ORDER.ORDER_DATA_CLEAR
    }
}
// vendor page change handle function for encash-record and order-data
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
            {
                throw new Error('Unknown page change event');
            }
    }
}

function SubmitWithdrawStatusChange(status) {
    return {
        type: ACTIONS_CONSTS.ORDER.ENCASH_SUBMIT_STATUS,
        status
    }
}

function IncomeData(data) {
    return {
        type: ACTIONS_CONSTS.ORDER.INCOME_DATA,
        data
    }
}

function IncomeDataFetchStatus(status) {
    return {
        type: ACTIONS_CONSTS.ORDER.INCOME_DATA_FETCH_STATUS,
        status
    }
}
export function FetchIncomeData() {
    return (dispatch, getState) => {
        dispatch(IncomeDataFetchStatus(PENDING));
        if (ENV === 'dev') {
            setTimeout(() => {
                dispatch(IncomeDataFetchStatus(RESOLVED));
                dispatch(IncomeData({
                    "totalOrders": 24,
                    "userAccount": {
                        "availableAmount": 19,
                        "createTime": 1523959986000,
                        "freezeAmount": 0,
                        "id": 0,
                        "status": "0",
                        "totalAmount": 100,
                        "updateTime": 1523960114000,
                        "userId": "UI0000000002"
                    }
                }));
            }, 500);
        } else if (ENV === 'prod') {
            fetch(APIS.INCOME_DATA_QUERY, {
                    method: 'post',
                    ...COMMON_FETCH_OPTIONS,
                })
                .then(res => res.json())
                .then(res => {
                    if (res.code === '1') {
                        dispatch(IncomeDataFetchStatus(RESOLVED));
                        dispatch(IncomeData(res.content));
                    } else {
                        dispatch(IncomeDataFetchStatus(REJECTED));
                    }
                })
                .catch(err => {
                    console.log(err);
                    dispatch(IncomeDataFetchStatus(REJECTED));
                });
        }
    }
}

export function SubmitWithdraw(data) {
    return (dispatch, getState) => {
        dispatch(SubmitWithdrawStatusChange(PENDING));
        if (ENV === 'dev') {
            setTimeout(() => {
                console.log(data);
                dispatch(SubmitWithdrawStatusChange(RESOLVED));
                dispatch(FetchIncomeData());
            }, 500);
        } else if (ENV === 'prod') {
            fetch(APIS.ENCASH_SUBMIT_WITHDRAW, {
                    method: 'post',
                    body: JSON.stringify(data),
                    ...COMMON_FETCH_OPTIONS,
                })
                .then(res => res.json())
                .then(res => {
                    if (res.code === '1') {
                        dispatch(SubmitWithdrawStatusChange(RESOLVED));
                        dispatch(FetchIncomeData());
                    } else {
                        dispatch(SubmitWithdrawStatusChange(REJECTED));
                    }
                })
                .catch(err => {
                    dispatch(SubmitWithdrawStatusChange(REJECTED));
                });
        }
    }
}

// 商品管理模块
function PushContentToStore(content) {
    return {
        type: ACTIONS_CONSTS.PRODUCT.PUSH_CONTENT_TO_STORE,
        content,
    }
}

function FetchProductStatusChange(status) {
    return {
        type: ACTIONS_CONSTS.PRODUCT.FETCH_PRODUCT_STATUS_CHANGE,
        status,
    }
}

let fakeProductContent = (pageNo, pageSize) => ({
    pageNo,
    pageSize,
    totalCount: 50,
    dataList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(item => ({
        "address": "yy16d",
        "createTime": 1524133658000,
        "endSaleTime": 1530360000000,
        "extra": "",
        "introduction": "炒鸡劲爆",
        "location": "武汉",
        "phone": "18627786302",
        "shelfStatus": "1",
        "showActor": "zzz",
        "showContentImgUrl": image,
        "showCoverUrl": image,
        "showId": "SI0000000005" + item,
        "showName": "相声",
        "showTypeId": "1",
        "singleShowDuration": 3600 + 60 * item,
        "startSaleTime": 1527681600000,
        "startTime": 1530360000000,
        "status": "1",
        "theaterName": "湖北剧院",
        "typeName": "演唱会",
        "updateTime": 1524133658000,
        "userId": "UI0000000002",
        "userName": "wxn",
        "productInfoList": [{
                "price": 88800,
                "productId": "PI0000000004",
                "showAreaId": "AI0000000001",
                "showAreaName": "贵宾席",
                "showId": "SI0000000004",
                "status": "0",
                "stock": 250
            },
            {
                "price": 28000,
                "productId": "PI0000000005",
                "showAreaId": "AI0000000001",
                "showAreaName": "贵宾席",
                "showId": "SI0000000004",
                "status": "0",
                "stock": 500
            },
            {
                "price": 128000,
                "productId": "PI0000000006",
                "showAreaId": "AI0000000001",
                "showAreaName": "贵宾席",
                "showId": "SI0000000004",
                "status": "0",
                "stock": 50
            },
            {
                "price": 999900,
                "productId": "PI0000000010",
                "showAreaId": "AI0000000001",
                "showAreaName": "贵宾席",
                "showId": "SI0000000004",
                "status": "0",
                "stock": 10
            }
        ],
    })),
});

export function FetchProductData(pageNo = 1, pageSize = 10) {
    return (dispatch, getState) => {
        dispatch(FetchProductStatusChange(PENDING));
        if (ENV === 'dev') {
            setTimeout(() => {
                dispatch(FetchProductStatusChange(RESOLVED));
                dispatch(PushContentToStore(
                    fakeProductContent(pageNo, pageSize)
                ));
            }, 500);
        } else {
            fetch(APIS.SHOW_QUERYLIST, {
                    method: 'post',
                    body: JSON.stringify({
                        pageNo,
                        pageSize,
                    }),
                    ...COMMON_FETCH_OPTIONS,
                })
                .then(res => res.json())
                .then(res => {
                    if (res.code === '1') {
                        dispatch(FetchProductStatusChange(RESOLVED));
                        dispatch(PushContentToStore(res.content));
                    } else {
                        dispatch(FetchProductStatusChange(REJECTED));
                    }
                })
                .catch(err => {
                    dispatch(FetchProductStatusChange(REJECTED));
                });
        }
    }
}

export function ProductPageChange(diff) {
    return {
        type: ACTIONS_CONSTS.PRODUCT.PRODUCT_PAGE_CHANGE,
        diff,
    }
}

function SubmitProductStatusChange(status) {
    return {
        type: ACTIONS_CONSTS.PRODUCT.SUBMIT_PRODUCT_STATUS_CHANGE,
        status,
    }
}

export function SubmitProductData(data, pageNo) {
    return (dispatch, getState) => {
        dispatch(SubmitProductStatusChange(PENDING));
        if (ENV === 'dev') {
            setTimeout(() => {
                console.log(data);
                dispatch(SubmitProductStatusChange(RESOLVED));
                dispatch(FetchProductData(pageNo));
            }, 500);
        } else {
            fetch(APIS.SHOW_ADD, {
                    method: 'post',
                    body: JSON.stringify(data),
                    ...COMMON_FETCH_OPTIONS,
                })
                .then(res => res.json())
                .then(res => {
                    if (res.code === '1') {
                        dispatch(SubmitProductStatusChange(RESOLVED));
                        dispatch(FetchProductData(pageNo));
                    } else {
                        dispatch(SubmitProductStatusChange(REJECTED));
                    }
                })
                .catch(err => {
                    console.log(err);
                    dispatch(SubmitProductStatusChange(REJECTED));
                });
        }
    }
}