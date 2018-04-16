import './index.css';
import './business-manage-src/style.less';
// react imports
import React, { Component } from 'react';
// other modules imports
import { HashRouter, NavLink, Route, Switch } from 'react-router-dom';
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { Button, Icon, message, LocaleProvider } from "antd";
import zhCN from 'antd/lib/locale-provider/zh_CN';

// components or miscellaneous imports
import reducers from './business-manage-src/reducers';
import CertificationManage from './business-manage-src/CertificationManage';
import AccountManage from './business-manage-src/AccountManage';
import OrderManage from "./business-manage-src/OrderManage";
import ProductManage from './business-manage-src/ProductManage';

// let or const definitions
let store = createStore(reducers, applyMiddleware(thunk));

// app entity
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routeRenderList: [
        { text: '认证信息', to: '/', path: '/', component: CertificationManage },
        { text: '商品管理', to: '/product', path: '/product', component: ProductManage },
        { text: '订单管理', to: '/order', path: '/order', component: OrderManage },
        { text: '账户管理', to: '/account', path: '/account', component: AccountManage },
      ],
      sideBarHeaderTitle: '后台管理系统'
    }
  }
  render() {
    let { routeRenderList, sideBarHeaderTitle } = this.state;
    return (
      <LocaleProvider locale={zhCN}>
        <Provider store={store}>
          <HashRouter>
            <div className='app-container'>
              <div className="side-bar">
                <div className="side-bar-header">
                  {sideBarHeaderTitle}
                </div>
                <ul className="menu-item-list">
                  {
                    routeRenderList.map((item, index) => (
                      <li key={`menu-item-li-${index}`}>
                        <NavLink
                          to={item.to}
                          exact={item.to === '/'}
                          className='menu-item'
                          activeClassName='active-menu-item'
                        >{item.text}</NavLink>
                      </li>
                    ))
                  }
                </ul>
                <Button
                  className='log-out-button'
                  type='primary'
                  onClick={() => {
                    fetch('/logout', {
                      credentials: 'include',
                      method: 'post'
                    })
                      .then(resp => resp.json())
                      .then(resp => {
                        let code = resp.code;
                        switch (code) {
                          case '1': {
                            message.success('退出登录成功', 1);
                            window.location.href = '/';
                          } break;
                          default: {
                            message.error('退出登录失败，请重试', 1);
                          }
                        }
                      })
                  }}
                >
                  <Icon type='logout' />
                  退出登录
              </Button>
              </div>
              <div className="content">
                <Switch>
                  {
                    routeRenderList.map((item, index) => (
                      <Route
                        key={`route-${index}`}
                        path={item.path}
                        exact={item.path === '/'}
                        component={item.component}
                      />
                    ))
                  }
                </Switch>
              </div>
            </div>
          </HashRouter>
        </Provider>
      </LocaleProvider>

    );
  }
}

export default App;
