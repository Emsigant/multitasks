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
import Index from './blog-index/Index';
import reducers from './blog-index/reducers';
// let or const definitions
let store = createStore(reducers, applyMiddleware(thunk));

// app entity
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routeRenderList: [
        { text: '首页', to: '/', path: '/', component: Index },
      ],
      sideBarHeaderTitle: 'Blog'
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
