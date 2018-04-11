import React, { Component } from 'react';
import { connect } from "react-redux";
import { List, Button, Modal, Input, Icon, Upload } from 'antd';

import { CerFetchData } from "./actions";

import image from '../c.jpg';

const ListItem = List.Item;

const mapCodeToStatus = {
    '1': '审核成功',
    '2': '审核未通过',
    '0': '审核中'
};

class SubmitForm extends Component {
    constructor(p) {
        super(p);
    }
    render() {
        return (
            <div className='plain-div'>
                <div className="form-wrapper">
                    <Input prefix={<Icon type='user' />} placeholder='商家名称' style={{ marginBottom: '1rem' }} />
                    <div style={{ marginBottom: '1rem', display: 'flex' }}>
                        <Upload style={{ marginRight: '1rem' }}>
                            <Button><Icon type="upload" />上传审核文件</Button>
                        </Upload>
                        <Button type='primary'>预览</Button>
                    </div>
                    <Input prefix={<Icon type='credit-card' />} placeholder='银行收款账户' style={{ marginBottom: '1rem' }} />
                    <Input prefix={<Icon type='bank' />} placeholder='收款账户名称' style={{ marginBottom: '1rem' }} />
                    <Button type='primary'>提交审核资料</Button>
                </div>
            </div>
        )
    }
}

class CertificationManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            showForm: false
        }
    }
    showModal() {
        this.setState({
            showModal: true
        })
    }
    hideModal() {
        this.setState({
            showModal: false
        })
    }
    componentDidMount() {
        this.props.dispatch(CerFetchData());
    }
    render() {
        let { data, msg, status, dispatch } = this.props;
        let { showModal, showForm } = this.state;
        let ListDataSource = [
            { key: '商家名称', id: 1, value: data ? data.userName : '' },
            { key: '认证文件', id: 2, value: data ? data.authImageUrl : '' },
            { key: '银行收款账户', id: 3, value: data ? data.bankCardNo : '' },
            { key: '收款账户名', id: 4, value: data ? data.bankName : '' },
            { key: '审核状态', id: 5, value: data ? mapCodeToStatus[data.status] : '' }
        ];
        return (
            <div className='route-view'>
                {
                    status !== 'rejected' ?
                        // not rejected
                        <div style={{width:'100%'}}>
                            {
                                JSON.stringify(data) === '{}' ?
                                    <div className="plain-div">
                                        尚未提交审核资料。请提交认证资料
                                        <SubmitForm />
                                    </div> :
                                    <div>
                                        <List
                                            loading={status === 'pending'}
                                            header={<div style={{ fontWeight: 'bold' }}>商家审核信息</div>}
                                            dataSource={ListDataSource}
                                            renderItem={
                                                item => (
                                                    <ListItem className='plain-list-item'>
                                                        <div className="plain-list-key">{item.key}</div>
                                                        <div className="plain-list-value">
                                                            {
                                                                item.id === 2 ?
                                                                    <Button
                                                                        disabled={!item.value}
                                                                        onClick={() => {
                                                                            this.showModal();
                                                                        }}
                                                                    >查看文件</Button> :
                                                                    item.value
                                                            }
                                                        </div>
                                                    </ListItem>
                                                )
                                            }
                                            bordered
                                        />
                                        {
                                            data ?
                                                data.status === '2' ?
                                                <div>
                                                    <hr style={{margin:'1rem 0'}}/>
                                                    <div className="plain-div">
                                                        审核<span style={{color:'red'}}>未通过</span>。请重新提交认证资料
                                                        <SubmitForm />
                                                    </div>
                                                </div>
                                                     :
                                                    null
                                                :
                                                null
                                        }
                                    </div>
                            }
                        </div> :
                        // rejected
                        <div className='plain-div'>
                            <div style={{ marginBottom: '1rem' }}>{msg}</div>
                            <Button
                                onClick={() => { dispatch(CerFetchData()) }} type='primary'
                            >重新加载</Button>
                        </div>
                }
                <Modal
                    visible={showModal}
                    title='商家审核文件'
                    footer={null}
                    width={800}
                    style={{ top: 20 }}
                    onCancel={() => { this.hideModal() }}
                >
                    <div className='modal-content'>
                        <img src={image} alt="商家审核图片" />
                    </div>
                </Modal>
                <Modal
                    visible={showForm}
                    title='提交认证材料'
                >

                </Modal>
            </div>
        )
    }
}

let mapStateToProps = state => {
    return {
        msg: state.Certification.msg,
        status: state.Certification.status,
        data: state.Certification.data
    }
}

export default connect(mapStateToProps)(CertificationManage);