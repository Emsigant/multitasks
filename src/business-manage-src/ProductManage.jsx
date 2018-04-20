import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Icon, Table, Modal } from "antd";
import { FetchProductData, ProductPageChange, } from "./actions";
import { FormatTime } from "./util";

class ProductManage extends Component {
    componentDidMount() {
        this.props.dispatch(FetchProductData());
    }
    render() {
        let { dispatch, dataList, pageNo, pageSize, fetchStatus, totalCount, } = this.props;
        return (
            <div className="route-view">
                <div className="fixed-header">
                    <Button style={{ marginTop: '.5rem' }} type='primary'>
                        <Icon type='plus' />
                        添加商品
                    </Button>
                </div>
                <div>
                    <Table
                        loading={fetchStatus === 'pending'}
                        bordered
                        rowKey={record => record.showId}
                        dataSource={dataList}
                        columns={
                            [
                                { title: '表演名称', dataIndex: 'showName', key: 'showName' },
                                { title: '表演封面图', dataIndex: 'showCoverUrl', key: 'showCoverUrl', render: (text, record) => (<img src={text} alt="演出封面图" height={100} />), height: 100, width: 100, },
                                { title: '表演种类', dataIndex: 'typeName', key: 'typeName' },
                                { title: '演员', dataIndex: 'showActor', key: 'showActor' },
                                { title: '上架状态', dataIndex: 'shelfStatus', key: 'shelfStatus', render: (text, reocrd) => (text === '0' ? '未上架' : text === '1' ? '审核中' : text === '3' ? '审核不通过' : '已上架') },
                                { title: '推荐状态', dataIndex: 'status', key: 'status', render: (text, record) => (text === '0' ? '不展示' : text === '1' ? '普通展示' : text === '2' ? '首页推荐' : text === '3' ? '小编推荐' : '首页+小编推荐') },
                                {
                                    title: '查看详情', render: (text, record) => (
                                        <a onClick={() => {
                                            Modal.info({
                                                title: '商品详情',
                                                maskClosable: true,
                                                width: 800,
                                                style: { top: 20 },
                                                content: (
                                                    <div className='modal-info-content'>
                                                        <div className='item'>
                                                            <div className="title">介绍：</div>
                                                            {record.introduction}
                                                        </div>
                                                        <div className='item'>
                                                            <div className="title">开始时间：</div>
                                                            {FormatTime(record.startTime)}
                                                        </div>
                                                        <div className='item'>
                                                            <div className="title">演出时间：</div>
                                                            {(+record.singleShowDuration / 60)}分钟
                                                        </div>
                                                        <div className='item'>
                                                            <div className="title">开始售票时间：</div>
                                                            {FormatTime(record.startSaleTime)}
                                                        </div>
                                                        <div className='item'>
                                                            <div className="title">结束售票时间：</div>
                                                            {FormatTime(record.endSaleTime)}
                                                        </div>
                                                        <div className='item'>
                                                            <div className="title">位置信息：</div>
                                                            {`${record.location}-${record.theaterName}(${record.address})`}
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }}>查看详情</a>
                                    )
                                },
                                {
                                    title: '查看产品列表', render: () => (
                                        <a onClick={() => {
                                            Modal.info({
                                                title:'产品列表',
                                                maskClosable: true,
                                                width: 800,
                                                style: { top: 20 },
                                                content: (
                                                    <div>
                                                        1111
                                                    </div>
                                                )
                                            })
                                        }}>查看产品列表</a>
                                    )
                                },
                                { title: '修改', render: () => (<a>修改</a>) },
                            ]
                        }
                        pagination={{
                            total: totalCount,
                            current: pageNo,
                            onChange: (targetPage, pageSize) => {
                                window.scrollTo(0, 0);
                                dispatch(ProductPageChange(targetPage - pageNo));
                                dispatch(FetchProductData(targetPage));
                            },
                            showQuickJumper: true,
                        }}
                    >
                    </Table>
                </div>
            </div>
        )
    }
}

let mstp = state => {
    return {
        dataList: state.Product.dataList,
        pageNo: state.Product.pageNo,
        pageSize: state.Product.pageSize,
        fetchStatus: state.Product.fetchStatus,
        totalCount: state.Product.totalCount,
    }
}

export default connect(mstp)(ProductManage);