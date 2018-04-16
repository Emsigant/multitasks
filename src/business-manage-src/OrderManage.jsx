import React, { Component } from "react";
import { NavLink, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { Table } from "antd";

import { FetchOrderData } from "./actions";

function C(text) {
    return () => (
        <div>{text}</div>
    )
}

class OrderSummary extends Component {
    componentDidMount() {
        this.props.dispatch(FetchOrderData());
    }
    render() {
        let { data } = this.props;
        return (
            <div>
                {   
                    data.lenght ?
                    data.map(item => (
                        <div key={`asfjkfj-${item}`}>{item}</div>
                    )):
                    'pending'
                }
            </div>
        )
    }
}

let mstp = state => {
    return {
        data: state.Order.orderData
    }
}

let ConnectedOrderSummary = connect(mstp)(OrderSummary);

class OrderManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subPages: [
                { text: '订单统计', to: '/', path: '/', component: () => (<ConnectedOrderSummary/>) },
                { text: '收入统计', to: '/income', path: '/income', component: C('收入统计') },
                { text: '发起提现', to: '/encash', path: '/encash', component: C('发起提现') },
                { text: '提现记录', to: '/encash-record', path: '/encash-record', component: C('提现记录') }
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