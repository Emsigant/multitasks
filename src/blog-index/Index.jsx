import React, { Component } from 'react';
import redux from 'redux';
import { connect } from 'react-redux';

import { FetchArticleList } from './actions';

class Index extends Component {
	constructor(p) {
		super(p);
		this.state = {
			_aq: this.props._aq,
		}
	}
	componentDidMount() {
		this.props.dispatch(FetchArticleList());
	}
	componentDidUpdate() {
		console.log(this.refs);
		if (Object.keys(this.refs).length > 0) {
			for (let i = 0; i < Object.keys(this.refs).length; i++) {
				setTimeout(() => {
					console.log('change', i);
					this.refs[Object.keys(this.refs)[i]].className = 'run-in';
				}, i * 100);

			}
		}
	}
	render() {
		let { data, status, _aq, } = this.props;
		return (
			<div>
				{status === 'pending' ? 'loading' : ''}
				{status === 'resolved' ?
					data.map((item, index) => (
						<div key={'article-' + item.title} className={_aq[index]} ref={'article' + index}>
							{item.title}
						</div>
					))
					: ''}
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