import React, { Component } from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { Input, Button, Icon, message } from 'antd';
import { HashRouter, Link, Route, Switch } from 'react-router-dom';

class LoginFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      p: '',
      u: '',
      pF: false,
      uF: false,
      loading: false
    }
  }
  onChange(e) {
    let target = e.target.dataset.target;
    let value = e.target.value;
    switch (target) {
      case 'username': {
        this.setState({
          u: value,
          uF: true
        });
      } break;
      case 'password': {
        this.setState({
          p: value,
          pF: true
        });
      } break;
      default: {
        throw new Error('Unknown onchange event');
      }
    }
  }
  login() {
    this.setState({
      loading: true
    });
    fetch('/business/login',
      {
        body: JSON.stringify({
          phone: this.state.u,
          password: this.state.p
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: "include",
        method: 'post'
      })
      .then(resp => resp.json())
      .then(resp => {
        switch (resp.code) {
          case '1': {
            message.success('登录成功');
            window.location.href = '/business/index';
          } break;
          case '2': {
            message.info('已登录');
          } break;
          case '4': {
            message.info('用户未注册');
          } break;
          default: {
            message.error('登录失败，请重试');
          }
        }
        this.setState({
          loading: false
        });
      })
      .catch(err => {
        message.error('登录失败，请重试');
        this.setState({
          loading: false
        });
      });
  }
  render() {
    let { p, u, pF, uF, loading } = this.state;
    return (
      <div className="login-frame">
        <p className='login-header'>登录</p>
        <Input
          onChange={(e) => { this.onChange(e) }}
          value={u}
          data-target='username'
          placeholder='电话号码'
          prefix={<Icon type='user' />}
          style={{ marginBottom: '.25rem' }}
        />
        <p className='danger'>
          {u === '' && uF ? '请输入用户名' : <span>&nbsp;</span>}
        </p>
        <Input
          onChange={(e) => { this.onChange(e) }}
          value={p}
          data-target='password'
          type='password'
          placeholder='密码'
          prefix={<Icon type='lock' />}
          style={{ marginBottom: '.25rem' }}
        />
        <p className='danger'>
          {p === '' && pF ? '请输入密码' : <span>&nbsp;</span>}
        </p>
        <Button
          style={{ width: '100%' }}
          type='primary'
          loading={loading}
          disabled={!(p !== '' && u !== '' && pF && uF)}
          onClick={() => { this.login() }}
        >登录</Button>
        <p className='frame-footer'><Link to='/register'>注册账号</Link></p>
      </div>
    )
  }
}

class RegisterFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      p: '',
      u: '',
      cp: '',
      n: '',
      pF: false,
      uF: false,
      cpF: false,
      nF: false,
      loading: false
    }
  }
  onChange(e) {
    let target = e.target.dataset.target;
    let value = e.target.value;
    switch (target) {
      case 'username': {
        this.setState({
          u: value,
          uF: true
        });
      } break;
      case 'password': {
        this.setState({
          p: value,
          pF: true
        });
      } break;
      case 'cfm-password': {
        this.setState({
          cp: value,
          cpF: true
        });
      } break;
      case 'nickname': {
        this.setState({
          n: value,
          nF: true
        });
      } break;
      default: {
        throw new Error('Unknown onchange event');
      }
    }
  }
  register() {
    this.setState({
      loading: true
    });
    fetch('/business/register',
      {
        body: JSON.stringify({
          phone: this.state.u,
          password: this.state.p,
          nickname: this.state.n
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: "include",
        method: 'post'
      })
      .then(resp => resp.json())
      .then(resp => {
        switch (resp.code) {
          case '1': {
            message.success('注册成功');
          } break;
          default: {
            message.error('注册失败，请重试');
          }
        }
        this.setState({
          loading: false
        });
      })
      .catch(err => {
        message.error('注册失败，请重试');
        this.setState({
          loading: false
        });
      });
  }
  render() {
    let { p, u, cp, n, nF, cpF, pF, uF, loading } = this.state;
    return (
      <div className="login-frame">
        <p className='login-header'>注册</p>
        <Input
          onChange={(e) => { this.onChange(e) }}
          value={u}
          data-target='username'
          placeholder='电话号码'
          prefix={<Icon type='user' />}
          style={{ marginBottom: '.25rem' }}
        />
        <p className='danger'>
          {u === '' && uF ? '请输入新用户名' : <span>&nbsp;</span>}
        </p>
        <Input
          onChange={(e) => { this.onChange(e) }}
          value={n}
          data-target='nickname'
          placeholder='昵称'
          prefix={<Icon type='user' />}
          style={{ marginBottom: '.25rem' }}
        />
        <p className='danger'>
          {n === '' && nF ? '请输入昵称' : <span>&nbsp;</span>}
        </p>
        <Input
          onChange={(e) => { this.onChange(e) }}
          value={p}
          data-target='password'
          type='password'
          placeholder='密码'
          prefix={<Icon type='lock' />}
          style={{ marginBottom: '.25rem' }}
        />
        <p className='danger'>
          {p === '' && pF ? '请输入密码' : <span>&nbsp;</span>}
        </p>
        <Input
          onChange={(e) => { this.onChange(e) }}
          value={cp}
          data-target='cfm-password'
          type='password'
          placeholder='确认密码'
          prefix={<Icon type='lock' />}
          style={{ marginBottom: '.25rem' }}
        />
        <p className='danger'>
          {p !== cp && cpF ? '请确保前后密码一致' : <span>&nbsp;</span>}
        </p>
        <Button
          style={{ width: '100%' }}
          type='primary'
          loading={loading}
          disabled={!(p !== '' && u !== '' && pF && uF && p === cp && cpF)}
          onClick={() => { this.register() }}
        >注册</Button>
        <p className='frame-footer'><Link to='/'>登录账号</Link></p>
      </div>
    )
  }
}

class App extends Component {
  render() {
    return (
      <HashRouter>
        <div className='login-wrapper'>
          <Switch>
            <Route path='/' exact component={LoginFrame} />
            <Route path='/register' component={RegisterFrame} />
          </Switch>
        </div>
      </HashRouter>
    );
  }
}

export default App;
