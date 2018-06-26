import React, { Component } from 'react';
import { Button, Icon, Spin, } from 'antd';
import { connect } from 'react-redux';

import { FetchArticleList } from './actions';
import avatar from './avatar.jpg';

const LoadSpin = () => (
	<div className='spin-wrapper'>
		<Spin indicator={<Icon type='loading' style={{ fontSize: 36 }} spin />} />
	</div>
)

class Index extends Component {
	constructor(p) {
		super(p);
		this.timeout = [];
	}
	componentDidMount() {
		this.props.dispatch(FetchArticleList());
	}
	componentDidUpdate() {
		if (Object.keys(this.refs).length > 0) {
			for (let i = 0; i < Object.keys(this.refs).length; i++) {
				this.timeout.push(setTimeout(() => {
					this.refs[Object.keys(this.refs)[i]].className = 'run-in';
				}, i * 100));
			}
		}
	}
	componentWillUnmount() {
		this.timeout.forEach(item => {
			clearTimeout(item);
		});
	}
	render() {
		let { data, status, _aq, lastStatusUpdateTimeStamp, } = this.props;
		return (
			<div className='content-wrapper'>
				<div className="bio">
					<img src={avatar} />
					<div className="nickname">Emsigant</div>
					<div className="email"> <a href="mailto:emsigant@qq.com">emsigant@qq.com</a></div>
					<div>{lastStatusUpdateTimeStamp}</div>
				</div>
				<div className="a-list">
					{status === 'pending' ?
						<LoadSpin />
						:
						status === 'resolved' ?
							data.map((item, index) => (
								<div key={'article-' + item.title} className={_aq[index]} ref={'article' + index}>
									<div className='title'><a href={(item.articleId ? '/article/' + item.articleId : '')}>{item.title || item.articleTitle}</a></div>
									<div className='date'>{item.date + '更新'}</div>
								</div>
							)).concat(
								<div className='button-panel' key='load-more-button'>
									<Button>加载更多</Button>
								</div>
							)
							: ''
					}
				</div>

			</div>
		)
	}
}

let mstp = (state) => {
	return {
		status: state.Index.status,
		data: state.Index.data,
		_aq: [].fillWithNum('run', state.Index.data.length),
		lastStatusUpdateTimeStamp: state.Index.lastStatusUpdateTimeStamp,
	}
}

export default connect(mstp)(Index);