import './index.css';
import './blog-index/style.less';
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
import reducers from './blog-index/reducers';
import Index from './blog-index/Index';
import Manage from './blog-index/Manage';


// let or const definitions
let store = createStore(reducers, applyMiddleware(thunk));

// app entity
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routeRenderList: [
        { text: '首页', to: '/', path: '/', component: Index, },
        { text: '其他', to: '/other', path: '/other', component: Manage, },
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
              <div className="app">
                <div className="header-bar">
                  <div className="app-header">
                    <div className="header-bar-text">
                      {sideBarHeaderTitle}
                    </div>
                    
                    <ul className="menu-list">
                      {
                        routeRenderList.map((item, index) => (
                          <li key={`menu-item-li-${item.to}`}>
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
                    <input type="text" placeholder='搜索'/>
                  </div>
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

            </div>
          </HashRouter>
        </Provider>
      </LocaleProvider>
    );
  }
}

export default App;
