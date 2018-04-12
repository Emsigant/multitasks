import React, { Component } from 'react';
import { connect } from "react-redux";
import { List, Button, Modal, Input, Icon, Upload, message } from 'antd';

import { CerFetchData, CerSubmit } from "./actions";
import WrappedInput from "./components/WrappedInput";
import image from '../c.jpg';

const ListItem = List.Item;

const mapCodeToStatus = {
	'1': '审核成功',
	'2': '审核未通过',
	'0': '审核中'
};

const UploadOptions = {
	name: 'file',
	action: '/common/upload',
	withCredentials: true
};

class SubmitForm extends Component {
	constructor(p) {
		super(p);
		this.state = {
			userName: '',
			bankCardNo: '',
			bankName: '',
			userNameTouched: false,
			bankCardNoTouched: false,
			bankNameTouched: false,
			authImageUrl: '',
			imageTouched: false,
			canUpload: true,
			showPreview: false
		}
	}
	onChangeHandler(e) {
		let target = e.target.dataset.target;
		let value = e.target.value;
		switch (target) {
			case 'userName': {
				this.setState({
					userName: value,
					userNameTouched: true
				})
			} break;
			case 'bankCardNo': {
				this.setState({
					bankCardNo: value,
					bankCardNoTouched: true
				})
			} break;
			case 'bankName': {
				this.setState({
					bankName: value,
					bankNameTouched: true
				})
			} break;
			default: {
				throw new Error('Unknown onchange event');
			}
		}
	}
	validate() {
		let { userName, userNameTouched,
			bankCardNo, bankCardNoTouched,
			bankName, bankNameTouched,
			authImageUrl
		} = this.state;
		return userName !== '' && userNameTouched
			&& bankCardNo !== '' && bankCardNoTouched
			&& bankName && bankNameTouched
			&& authImageUrl !== ''
	}
	render() {
		let { userName, userNameTouched,
			bankCardNo, bankCardNoTouched,
			bankName, bankNameTouched,
			authImageUrl, canUpload, imageTouched,
			showPreview
		} = this.state;
		let { submitStatus, dispatch } = this.props;
		return (
			<div className='plain-div'>
				<div className="form-wrapper">
					<WrappedInput
						prefixType='user'
						holder='商家名称'
						target='userName'
						touched={userNameTouched}
						inputValue={userName}
						change={(e) => { this.onChangeHandler(e) }}
					/>
					<div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
						<Upload
							{...UploadOptions}
							disabled={!canUpload}
							onRemove={false}
							showUploadList={false}
							onChange={(info) => {
								this.setState({ imageTouched: true });
								if (info.file.response && info.file.response.code === '1') {
									message.success('上传图片成功');
									this.setState({
										authImageUrl: info.file.response.content,
										canUpload: false
									})
								} else if (info.file.response && info.file.response.code !== '1') {
									message.error('上传图片失败');
									this.setState({
										authImageUrl: '',
										canUpload: true
									});
								}
							}}
						>
							<Button disabled={!canUpload}><Icon type="upload" />上传审核文件</Button>
						</Upload>
						<Button
							onClick={() => { this.setState({ showPreview: true }) }}
							disabled={authImageUrl === ''}
							style={{ marginLeft: '1rem' }}
						>
							预览审核文件
						</Button>
						<Modal
							visible={showPreview}
							footer={null}
							onCancel={() => { this.setState({ showPreview: false }) }}
							width={800}
							style={{ top: 24 }}
						>
							<img src={authImageUrl} alt="预览审核文件" style={{ width: '100%' }} />
						</Modal>
						{
							authImageUrl === '' && imageTouched && !canUpload ?
								<span className="warning-span">请上传文件</span> :
								null
						}
					</div>
					<WrappedInput
						prefixType='credit-card'
						holder='银行收款账户'
						target='bankCardNo'
						touched={bankCardNoTouched}
						inputValue={bankCardNo}
						change={(e) => { this.onChangeHandler(e) }}
					/>
					<WrappedInput
						prefixType='bank'
						holder='收款账户名称'
						target='bankName'
						touched={bankNameTouched}
						inputValue={bankName}
						change={(e) => { this.onChangeHandler(e) }}
					/>
					<Button type='primary' style={{ width: '270px' }}
						disabled={!this.validate.call(this)}
						loading={submitStatus === 'pending'}
						onClick={() => {
							// 提交表单
							dispatch(CerSubmit({
								userName,
								bankCardNo,
								authImageUrl,
								bankName
							}));
						}}
					>提交审核资料</Button>
				</div>
			</div>
		)
	}
}

class CertificationManage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false
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
		let { data, msg, status, dispatch, submitStatus } = this.props;
		let { showModal } = this.state;
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
						<div>
							{
								JSON.stringify(data) === '{}' ?
									<div>
										尚未提交审核资料。请提交认证资料
                    <SubmitForm submitStatus={submitStatus} dispatch={dispatch} />
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
														<hr style={{ margin: '1rem 0', borderBottom: 'none' }} />
														<div className="plain-div">
															审核<span style={{ color: 'red' }}>未通过</span>。请重新提交认证资料
                              <SubmitForm submitStatus={submitStatus} dispatch={dispatch} />
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
						<img src={data ? data.authImageUrl : ''} alt="商家审核图片" />
					</div>
				</Modal>
			</div>
		)
	}
}

let mapStateToProps = state => {
	return {
		msg: state.Certification.msg,
		status: state.Certification.status,
		data: state.Certification.data,
		submitStatus: state.Certification.submitStatus
	}
}

export default connect(mapStateToProps)(CertificationManage);