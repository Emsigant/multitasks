import React, { Component } from "react";
import { NavLink, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { Table } from "antd";

import { FetchOrderData, OrderDataClear, FetchEncashRecordData, OrderPageChange } from "./actions";
import { mapTitleToKey } from "./CONSTS";
function C(text) {
    return () => (
        <div>{text}</div>
    )
}

function ComponentGenerator({ fetchFn, clearFn, mstp, uniqueKeyPrefix, tableColumns, tablePagination, pageFn }) {
    return () => {
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
        return connect(mstp)(SubComponent);
    }
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
    uniqueKeyPrefix: 'order-data-',
    tableColumns: ['地址', '总金额', '演出名称', '演出开始时间', '状态', '类型名称'].map(item => ({
        title: item,
        dataIndex: mapTitleToKey[item],
        key: mapTitleToKey[item],
    })),
    pageFn: OrderPageChange('order-data')
})();

// let ConnectedEncashRecord = ComponentGenerator(
//     FetchEncashRecordData,
//     OrderDataClear,
//     state => {
//         return {
//             data: state.Order.encashRecordData,
//             dataStatus: state.Order.encashRecordDataStatus
//         }
//     },
//     'encash-record-'
// )();

class OrderManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subPages: [
                { text: '订单统计', to: '/', path: '/', component: ConnectedOrderData },
                { text: '收入统计', to: '/income', path: '/income', component: C('收入统计') },
                { text: '发起提现', to: '/encash', path: '/encash', component: C('发起提现') },
                { text: '提现记录', to: '/encash-record', path: '/encash-record', component: C('zzz') }
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