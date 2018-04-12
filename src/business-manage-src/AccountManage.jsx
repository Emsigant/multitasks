import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, Button, Input } from "antd";

import { AccountSubmit } from "./actions";

import WrappedInput from './components/WrappedInput';

class AccountManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oldP: '',
            newP: '',
            oldPT: false,
            newPT: false
        }
    }
    change(e) {
        let target = e.target.dataset.target;
        let value = e.target.value;
        switch (target) {
            case 'old-psw': {
                this.setState({
                    oldP: value,
                    oldPT: true
                });
            } break;
            case 'new-psw': {
                this.setState({
                    newP: value,
                    newPT: true
                });
            } break;
            default: {
                throw new Error('Unknown onchange event, or miss prop `target` for WrappedInput');
            }
        }
    }
    validate() {
        let { oldP, oldPT, newP, newPT } = this.state;
        return oldP && oldPT && newP && newPT && oldP !== newP;
    }
    componentWillReceiveProps(newProps) {
        if (newProps.submitStatus === 'resolved') {
            this.setState({
                oldP: '',
                newP: '',
                oldPT: false,
                newPT: false
            });
        }
    }
    submitNewPsw() {
        let { oldP, newP } = this.state;
        this.props.dispatch(AccountSubmit({
            oldPassword: oldP,
            newPassword: newP
        }));
    }
    render() {
        let { dispatch, submitStatus } = this.props;
        let { oldP, oldPT, newP, newPT } = this.state;
        return (
            <div className="route-view">
                <WrappedInput
                    touched={oldPT}
                    inputValue={oldP}
                    holder='旧密码'
                    prefixType='lock'
                    change={(e) => { this.change(e) }}
                    target='old-psw'
                    type='password'
                />
                <WrappedInput
                    touched={newPT}
                    inputValue={newP}
                    holder='新密码'
                    prefixType='lock'
                    change={(e) => { this.change(e) }}
                    target='new-psw'
                />
                <Button
                    type='primary'
                    disabled={!this.validate.call(this)}
                    loading={submitStatus === 'pending'}
                    onClick={() => this.submitNewPsw()}
                >修改密码</Button>
                {
                    oldP === newP && newPT && oldP && newP ?
                        <span className="warning-span">
                            新密码应该和旧密码不同
                        </span> :
                        null
                }
            </div>
        )
    }
}

let mapStateToProps = state => {
    return {
        submitStatus: state.Account.submitStatus
    }
}

export default connect(mapStateToProps)(AccountManage);