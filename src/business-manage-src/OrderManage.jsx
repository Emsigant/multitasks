import React, { Component } from "react";
import { NavLink, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { Table, Button, InputNumber, Input } from "antd";

import { FetchOrderData, OrderDataClear, FetchEncashRecordData, OrderPageChange, SubmitWithdraw, FetchIncomeData } from "./actions";
import { mapTitleToKeyInOrder } from "./CONSTS";

function C(text) {
    return () => (
        <div>{text}</div>
    )
}

function ComponentGenerator({ fetchFn, clearFn, mstp, uniqueKeyPrefix, tableColumns, tablePagination, pageFn }) {
    class SubComponent extends Component {
        componentDidMount() {
            this.props.dispatch(fetchFn());
        }
        componentWillUnmount() {
            this.props.dispatch(clearFn());
        }
        render() {
            let { data, dataStatus, total, currentPage, dispatch } = this.props;
            return (
                <div>
                    <Table
                        bordered
                        rowKey={record => record[uniqueKeyPrefix]} // each record must have a unique id
                        dataSource={data}
                        pagination={{
                            current: currentPage,
                            total: total,
                            onChange: (targetPage, pageSize) => {
                                dispatch(pageFn(targetPage - currentPage));
                                dispatch(clearFn());
                                dispatch(fetchFn(targetPage));
                            },
                            showQuickJumper: true,
                            hideOnSinglePage: true
                        }}
                        loading={dataStatus === 'pending'}
                        columns={tableColumns}
                    />
                </div>
            )
        }
    }
    return () => connect(mstp)(SubComponent);
}

let ConnectedOrderData = ComponentGenerator({
    fetchFn: FetchOrderData,
    clearFn: OrderDataClear,
    mstp: state => {
        return {
            data: state.Order.orderData,
            dataStatus: state.Order.orderDataStatus,
            currentPage: state.Order.orderDataCurrentPage,
            total: state.Order.orderDataTotal
        }
    },
    uniqueKeyPrefix: 'orderId',
    tableColumns: ['地址', '总金额', '演出名称', '演出开始时间', '状态', '类型名称'].map(item => ({
        title: item,
        dataIndex: mapTitleToKeyInOrder[item],
        key: mapTitleToKeyInOrder[item],
    })),
    pageFn: OrderPageChange('order-data')
})();

let ConnectedEncashRecord = ComponentGenerator({
    fetchFn: FetchEncashRecordData,
    clearFn: OrderDataClear,
    mstp: state => {
        return {
            data: state.Order.encashRecordData,
            dataStatus: state.Order.encashRecordDataStatus,
            currentPage: state.Order.encashRecordDataCurrentPage,
            total: state.Order.encashRecordDataTotal
        }
    },
    uniqueKeyPrefix: 'withdrawOrderId',
    tableColumns: ['提现银行卡号', '收款人', '提现金额', '提现时间', '提现状态'].map(item => ({
        title: item,
        dataIndex: mapTitleToKeyInOrder[item],
        key: mapTitleToKeyInOrder[item],
    })),
    pageFn: OrderPageChange('encash-record')
})();

class WithdrawPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            withdrawAmount: 0
        }
    }
    componentDidMount() {
        this.props.dispatch(FetchIncomeData());
    }
    render() {
        let { dispatch, submitStatus, incomeData } = this.props;
        let { withdrawAmount } = this.state;
        return (
            <div>
                <div className='plain-div-with-padding'>
                    <span>当前可用余额：</span>
                    {incomeData ? incomeData.total : 0}
                </div>
                <div className='plain-div-with-padding'>
                    <span style={{ marginRight: '1rem' }}>请输入提现金额：</span>
                    <InputNumber
                        min={0}
                        max={incomeData ? incomeData.total : 0}
                        value={withdrawAmount}
                        style={{ marginRight: '1rem' }}
                        onChange={(e) => {
                            if (e === '') { this.setState({ withdrawAmount: 0 }) }
                            this.setState({ withdrawAmount: e });
                        }} />
                    <Button type='primary' onClick={() => dispatch(SubmitWithdraw(2000))} loading={submitStatus === 'pending'} disabled={withdrawAmount < 1}>
                        提现
                </Button>
                </div>
            </div>
        )
    }
}
let _cwithdrawpage_mstp = state => ({
    submitStatus: state.Order.encashSubmitStatus,
    incomeData: state.Order.incomeData
})
let _cwithdrawpage = connect(_cwithdrawpage_mstp)(WithdrawPage);

class OrderManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subPages: [
                { text: '订单统计', to: '/', path: '/', component: ConnectedOrderData },
                { text: '收入统计&提现', to: '/income-encash', path: '/income-encash', component: _cwithdrawpage },
                { text: '提现记录', to: '/encash-record', path: '/encash-record', component: ConnectedEncashRecord }
            ]
        }
    }
    render() {
        let { match } = this.props;
        let { subPages } = this.state;
        return (
            <div className="route-view">
                <div className="fixed-header">
                    {
                        subPages.map((item, index) => (
                            <NavLink
                                key={`fixed-header-item-${index}`}
                                className="fixed-header-item"
                                activeClassName='fixed-header-item-active'
                                to={`${match.url + (item.to === '/' ? '' : item.to)}`}
                                exact={item.to === '/'}
                            >{item.text}</NavLink>
                        ))
                    }
                </div>
                <div>
                    <Switch>
                        {
                            subPages.map((item, index) => (
                                <Route
                                    key={`fixed-header-item-route-${index}`}
                                    exact={item.to === '/'}
                                    path={`${match.url + (item.path === '/' ? '' : item.path)}`}
                                    component={item.component}
                                />
                            ))
                        }
                    </Switch>
                </div>
            </div>
        )
    }
}

export default OrderManage;