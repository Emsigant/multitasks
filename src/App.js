// react imports
import React, { Component } from 'react';
// other modules imports
import { HashRouter, NavLink, Route, Switch } from 'react-router-dom';
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

// css, less or images imports
import './index.css';
import './business-manage-src/style.less';

// components or miscellaneous imports
import reducers from './business-manage-src/reducers';
import CertificationManage from './business-manage-src/CertificationManage';

// let or const definitions
let store = createStore(reducers, applyMiddleware(thunk));

// app entity
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routeRenderList: [
        { text: '认证信息', to: '/', path: '/', component: CertificationManage },
        { text: '商品管理', to: '/product', path: '/product', component: () => (<div>product</div>) },
        { text: '订单管理', to: '/order', path: '/order', component: () => (<div>order</div>) },
        { text: '账户管理', to: '/account', path: '/account', component: () => (<div>account</div>) },
      ],
      sideBarHeaderTitle: '后台管理系统'
    }
  }
  render() {
    let { routeRenderList, sideBarHeaderTitle } = this.state;
    return (
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
    );
  }
}

export default App;
