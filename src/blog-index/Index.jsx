import React, { Component } from 'react';
import redux from 'redux';
import { connect } from 'react-redux';

import { FetchArticleList } from './actions';
import avatar from './avatar.jpg';

class Index extends Component {
	constructor(p) {
		super(p);
		this.state = {
			_aq: this.props._aq,
		}
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
		this.timeout = [];
	}
	render() {
		let { data, status, _aq, } = this.props;
		return (
			<div className='content-wrapper'>
				<div className="bio">
					<img src={avatar} />
					<div className="nickname">Emsigant</div>
					<div className="email"> <a href="mailto:emsigant@qq.com">emsigant@qq.com</a></div>
				</div>
				{status === 'pending' ? 'loading' : ''}
				<div className="a-list">
					{status === 'resolved' ?
						data.map((item, index) => (
							<div key={'article-' + item.title} className={_aq[index]} ref={'article' + index}>
								<div className='title'><a href={(item.articleId ? '/article/' + item.articleId : '')}>{item.title || item.articleTitle}</a></div>
								<div className='date'>{item.date + '更新'}</div>
							</div>
						))
						: ''}
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
	}
}

export default connect(mstp)(Index);