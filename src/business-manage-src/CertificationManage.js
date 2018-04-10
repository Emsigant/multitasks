import React, { Component } from 'react';
import { connect } from "react-redux";

import { CerFetchData } from "./actions";

class CertificationManage extends Component {
    componentDidMount() {
        this.props.dispatch(CerFetchData());
    }
    render() {
        return (
            <div>
                <div>{this.props.status} <br /> {this.props.msg}</div>
                { this.props.status === 'rejected' ? <a onClick={()=>{this.props.dispatch(CerFetchData())}}>重新加载</a> : null }
            </div>
        )
    }
}

let mapStateToProps = state => {
    return {
        msg: state.Certification.msg,
        status: state.Certification.status
    }
}

export default connect(mapStateToProps)(CertificationManage);