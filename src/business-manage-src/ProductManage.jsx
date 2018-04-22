import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Icon, Table, Modal, Input, Select, DatePicker, TimePicker, Upload, message, } from "antd";
import moment from "moment";
import 'moment/locale/zh-cn';
import { FetchProductData, ProductPageChange, SubmitProductData, UpdateProductData, } from "./actions";
import { FormatTime } from "./util";

moment.locale('zh-cn');
const Option = Select.Option;
const TextArea = Input.TextArea;
const TimeFormat = 'HH:mm';

class ProductManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSubmitFormModal: false,
            showUpdateFormModal: false,
            typeName: '请选择',
            showActor: '',
            showCoverUrl: '',
            singleShowDuration: '',
            showName: '',
            introduction: '',
            startTime: '',
            startTimeDate: '',
            address: '',
            location: '',
            startSaleTime: '',
            startSaleTimeDate: '',
            endSaleTime: '',
            endSaleTimeDate: '',
            theaterName: '',
            productInfoList: [],
            _update: {},
        }
    }
    onChange(e) {
        let t = e.target.dataset.target;
        let value = e.target.value;
        let _update = this.state._update;
        switch (t) {
            case 'showName': {
                this.setState({
                    showName: value,
                })
            } break;
            case 'showActor': {
                this.setState({
                    showActor: value,
                })
            } break;
            case 'singleShowDuration': {
                this.setState({
                    singleShowDuration: value,
                })
            } break;
            case 'introduction': {
                this.setState({
                    introduction: value,
                })
            } break;
            case 'location': {
                this.setState({
                    location: value,
                })
            } break;
            case 'theaterName': {
                this.setState({
                    theaterName: value,
                })
            } break;
            case 'address': {
                this.setState({
                    address: value,
                })
            } break;
            case '_showName': {
                this.setState({
                    _update: { ..._update, showName: value, },
                })
            } break;
            case '_showActor': {
                this.setState({
                    _update: { ..._update, showActor: value, },
                })
            } break;
            case '_singleShowDuration': {
                this.setState({
                    _update: { ..._update, singleShowDuration: value, },
                })
            } break;
            case '_introduction': {
                this.setState({
                    _update: { ..._update, introduction: value, },
                })
            } break;
            case '_location': {
                this.setState({
                    _update: { ..._update, location: value, },
                })
            } break;
            case '_theaterName': {
                this.setState({
                    _update: { ..._update, theaterName: value, },
                })
            } break;
            case '_address': {
                this.setState({
                    _update: { ..._update, address: value, },
                })
            } break;
            default: {
                let reg = /$_*/;
                if (reg.test(t)) {
                    t = Array.prototype.slice.call(t, 1).join('');
                    let _arr = t.split('-')
                    let _index = +_arr[0];
                    let _attr = _arr[1];
                    let _a = [..._update.productInfoList];
                    if (_attr === 'price') {
                        _a[_index][_attr] = value * 100;
                    } else if (_attr === 'stock') {
                        _a[_index][_attr] = +value;
                    } else {
                        _a[_index][_attr] = value;
                    }
                    this.setState({
                        _update: { ..._update, productInfoList: _a },
                    });
                } else {
                    let _arr = t.split('-')
                    let _index = +_arr[0];
                    let _attr = _arr[1];
                    let _a = [...this.state.productInfoList];
                    if (_attr === 'price') {
                        _a[_index][_attr] = value * 100;
                    } else if (_attr === 'stock') {
                        _a[_index][_attr] = +value;
                    } else {
                        _a[_index][_attr] = value;
                    }
                    this.setState({
                        productInfoList: _a,
                    });
                }
            }
        }
    }
    componentDidMount() {
        this.props.dispatch(FetchProductData());
    }
    setUpdateData(data) {
        this.setState({
            _update: JSON.parse(JSON.stringify(data)),
        });
    }
    componentWillReceiveProps(newProps) {
        if (newProps.submitStatus === 'resolved') {
            this.setState({
                showSubmitFormModal: false,
                typeName: '请选择',
                showActor: '',
                showCoverUrl: '',
                singleShowDuration: '',
                showName: '',
                introduction: '',
                startTime: '',
                startTimeDate: '',
                address: '',
                location: '',
                startSaleTime: '',
                startSaleTimeDate: '',
                endSaleTime: '',
                endSaleTimeDate: '',
                theaterName: '',
                productInfoList: [],
            });
        }
        if (newProps.updateStatus === 'resolved') {
            this.setState({ showUpdateFormModal: false });
        }
    }
    render() {
        let { dispatch, dataList, pageNo, pageSize, fetchStatus, totalCount, updateStatus, submitStatus, } = this.props;
        let {
            showSubmitFormModal, showUpdateFormModal, typeName, showActor, showCoverUrl, singleShowDuration, showName,
            introduction, startTime, address, location, startSaleTime, endSaleTime, theaterName, productInfoList, _update,
        } = this.state;
        return (
            <div className="route-view">
                <div className="fixed-header">
                    <Button
                        style={{ marginTop: '.5rem' }}
                        type='primary'
                        onClick={() => { this.setState({ showSubmitFormModal: true }) }}
                    >
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
                                    title: '查看产品列表', render: (text, record) => (
                                        <a onClick={() => {
                                            Modal.info({
                                                title: '产品列表',
                                                maskClosable: true,
                                                width: 800,
                                                style: { top: 20 },
                                                content: (
                                                    <div>
                                                        <Table
                                                            bordered
                                                            rowKey={record => record.productId}
                                                            dataSource={record.productInfoList}
                                                            columns={[
                                                                { title: '区域类别', key: 'showAreaName', dataIndex: 'showAreaName' },
                                                                { title: '价格', key: 'price', dataIndex: 'price', render: (text) => ('￥' + (+text / 100).toFixed(2)) },
                                                                { title: '库存', key: 'stock', dataIndex: 'stock' },
                                                                { title: '状态', key: 'status', dataIndex: 'status', render: (text) => (text === '0' ? '未出售' : text === '1' ? '出售中' : text === '2' ? '售罄' : '停止出售') },
                                                            ]}
                                                            pagination={{
                                                                hideOnSinglePage: true,
                                                                pageSize: 1000,
                                                            }}
                                                        />
                                                    </div>
                                                )
                                            })
                                        }}>查看产品列表</a>
                                    )
                                },
                                {
                                    title: '修改', render: (text, record) => (
                                        <Button
                                            size='small' type='primary'
                                            onClick={() => {
                                                this.setUpdateData(record);
                                                this.setState({ showUpdateFormModal: true });
                                            }}
                                        ><Icon type="edit" />修改</Button>
                                    )
                                },
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
                    />
                </div>
                <div data-comment='submit-form'>
                    <Modal
                        visible={showSubmitFormModal}
                        width={800}
                        style={{ top: 20 }}
                        onCancel={() => { this.setState({ showSubmitFormModal: false }) }}
                        title='添加演出'
                        destroyOnClose
                        okText='确认添加'
                        onOk={() => {
                            let _data = {
                                showSubmitFormModal, typeName, showActor, showCoverUrl, singleShowDuration, showName,
                                introduction, startTime, address, location, startSaleTime, endSaleTime, theaterName, productInfoList,
                            };
                            dispatch(SubmitProductData(_data, pageNo));
                        }}
                    >
                        <div className="modal-input-wrapper">
                            <div className="key">演出名称</div>
                            <Input value={showName} data-target='showName' onChange={e => this.onChange(e)}></Input>
                        </div>
                        <div className="modal-input-wrapper">
                            <div className="key">演出类型</div>
                            <Select
                                value={typeName}
                                style={{ width: 120 }}
                                onChange={value => this.setState({ typeName: value })}
                            >
                                <Option value='演唱会'>演唱会</Option>
                                <Option value='音乐剧'>音乐剧</Option>
                                <Option value='音乐会'>音乐会</Option>
                            </Select>
                        </div>
                        <div className="modal-input-wrapper">
                            <div className="key">主要演员</div>
                            <Input value={showActor} data-target='showActor' onChange={e => this.onChange(e)}></Input>
                        </div>
                        <div className="modal-input-wrapper">
                            <div className="key">封面图片</div>
                            <Upload
                                action='/common/upload'
                                withCredentials={true}
                                showUploadList={false}
                                onChange={(upload) => {
                                    if (upload.file.status === 'done' && upload.file.response.code === '1') {
                                        message.success('上传图片成功', .5);
                                        this.setState({
                                            showCoverUrl: upload.file.response.content,
                                        });
                                    } else {
                                        message.success('上传图片失败，请重试');
                                    }
                                }}
                            >
                                <Button type='primary'>
                                    <Icon type='upload' />
                                    上传封面图片
                            </Button>
                            </Upload>
                            {
                                showCoverUrl === '' ?
                                    null :
                                    <Button
                                        style={{ marginLeft: '1rem' }}
                                        onClick={() => {
                                            Modal.info({
                                                title: '预览封面图片',
                                                maskClosable: true,
                                                content: (
                                                    <div>
                                                        <img
                                                            style={{ width: '100%' }}
                                                            src={showCoverUrl}
                                                            alt="预览封面图片"
                                                        />
                                                    </div>
                                                )
                                            })
                                        }}
                                    >
                                        预览
                                </Button>
                            }

                        </div>
                        <div className="modal-input-wrapper">
                            <div className="key">演出开始时间</div>
                            <DatePicker
                                onChange={(date, dateString) => {
                                    this.setState({ startTimeDate: dateString });
                                }}
                            />
                            <TimePicker
                                format={TimeFormat}
                                style={{ marginLeft: '1rem' }}
                                onChange={(date, dateString) => {
                                    let _t = new Date(moment(this.state.startTimeDate + ' ' + dateString, 'YYYY-MM-DD hh:mm')).getTime();
                                    this.setState({ startTime: _t });
                                }}
                            />
                        </div>
                        <div className="modal-input-wrapper">
                            <div className="key">演出时长（分钟）</div>
                            <Input value={singleShowDuration} data-target='singleShowDuration' onChange={e => this.onChange(e)}></Input>
                        </div>
                        <div className="modal-input-wrapper">
                            <div className="key">售票开始时间</div>
                            <DatePicker
                                onChange={(date, dateString) => {
                                    this.setState({ startSaleTimeDate: dateString });
                                }}
                            />
                            <TimePicker
                                format={TimeFormat}
                                style={{ marginLeft: '1rem' }}
                                onChange={(date, dateString) => {
                                    let _t = new Date(moment(this.state.startSaleTimeDate + ' ' + dateString, 'YYYY-MM-DD hh:mm')).getTime();
                                    this.setState({ startSaleTime: _t });
                                }}
                            />
                        </div>
                        <div className="modal-input-wrapper">
                            <div className="key">结束售票时间</div>
                            <DatePicker
                                onChange={(date, dateString) => {
                                    this.setState({ endSaleTimeDate: dateString });
                                }}
                            />
                            <TimePicker
                                format={TimeFormat}
                                style={{ marginLeft: '1rem' }}
                                onChange={(date, dateString) => {
                                    let _t = new Date(moment(this.state.endSaleTimeDate + ' ' + dateString, 'YYYY-MM-DD hh:mm')).getTime();
                                    this.setState({ endSaleTime: _t });
                                }}
                            />
                        </div>
                        <div className="modal-input-wrapper" style={{ alignItems: 'flex-start' }}>
                            <div className="key" style={{ lineHeight: '32px' }}>介绍</div>
                            <TextArea value={introduction} data-target='introduction' onChange={e => this.onChange(e)}></TextArea>
                        </div>
                        <div className="modal-input-wrapper">
                            <div className="key">城市</div>
                            <Input value={location} data-target='location' onChange={e => this.onChange(e)}></Input>
                        </div>
                        <div className="modal-input-wrapper">
                            <div className="key">剧院</div>
                            <Input value={theaterName} data-target='theaterName' onChange={e => this.onChange(e)}></Input>
                        </div>
                        <div className="modal-input-wrapper">
                            <div className="key">地址</div>
                            <Input value={address} data-target='address' onChange={e => this.onChange(e)}></Input>
                        </div>
                        <div className="modal-input-wrapper" style={{ alignItems: 'flex-start' }}>
                            <div className="key" style={{ lineHeight: '32px' }}>产品列表</div>
                            <div style={{ flex: 1 }}>
                                <div className="row-input-wrapper">
                                    <div style={{ flex: 1, marginRight: '1rem' }}>区域名</div>
                                    <div style={{ flex: 1, marginRight: '1rem' }}>价格(人民币)</div>
                                    <div style={{ flex: 1, marginRight: '1rem' }}>票数</div>
                                    <Button type='danger' style={{ visibility: 'hidden' }}>
                                        <Icon type='delete' />
                                    </Button>
                                </div>
                                {
                                    productInfoList.map((item, index) => (
                                        <div key={'temp-div-' + index} className='row-input-wrapper'>
                                            <Input
                                                placeholder='区域名'
                                                value={item.showAreaName}
                                                data-target={index + '-showAreaName'}
                                                onChange={e => this.onChange(e)}
                                            />
                                            <Input
                                                placeholder='价格'
                                                value={+item.price / 100}
                                                style={{ marginLeft: '1rem' }}
                                                data-target={index + '-price'}
                                                onChange={e => this.onChange(e)}
                                            />
                                            <Input
                                                placeholder='票数'
                                                value={item.stock}
                                                style={{ marginLeft: '1rem' }}
                                                data-target={index + '-stock'}
                                                onChange={e => this.onChange(e)}
                                            />
                                            <Button
                                                type='danger'
                                                style={{ marginLeft: '1rem' }}
                                                onClick={() => {
                                                    let _arr = productInfoList;
                                                    if (index === 0) {
                                                        this.setState({
                                                            productInfoList: _arr.slice(1),
                                                        })
                                                    } else {
                                                        this.setState({
                                                            productInfoList: [..._arr.slice(0, index), ..._arr.slice(index + 1)],
                                                        })
                                                    }
                                                }}
                                            >
                                                <Icon type='delete' />
                                            </Button>
                                        </div>
                                    ))
                                }
                                <Button
                                    type='primary'
                                    onClick={() => {
                                        let _arr = this.state.productInfoList;
                                        _arr.push({
                                            showAreaName: '',
                                            price: 0,
                                            stock: 0,
                                        });
                                        this.setState({
                                            productInfoList: _arr,
                                        });
                                    }}
                                >
                                    <Icon type='plus' /> 添加产品
                            </Button>
                            </div>
                        </div>
                    </Modal>
                </div>
                <div data-comment="update-form">
                    <Modal
                        visible={showUpdateFormModal}
                        width={800}
                        style={{ top: 20 }}
                        onCancel={() => {
                            this.setUpdateData({});
                            this.setState({ showUpdateFormModal: false });
                        }}
                        title='修改演出信息'
                        destroyOnClose
                        okText='确认修改'
                        onOk={() => {
                            dispatch(UpdateProductData(_update, pageNo));
                        }}
                    >
                        <div className="modal-input-wrapper">
                            <div className="key">演出名称</div>
                            <Input value={_update.showName} data-target='_showName' onChange={e => this.onChange(e)}></Input>
                        </div>
                        <div className="modal-input-wrapper">
                            <div className="key">演出类型</div>
                            <Select
                                value={_update.typeName}
                                style={{ width: 120 }}
                                onChange={value => this.setState({ _update: { ..._update, typeName: value, } })}
                            >
                                <Option value='演唱会'>演唱会</Option>
                                <Option value='音乐剧'>音乐剧</Option>
                                <Option value='音乐会'>音乐会</Option>
                            </Select>
                        </div>
                        <div className="modal-input-wrapper">
                            <div className="key">主要演员</div>
                            <Input value={_update.showActor} data-target='_showActor' onChange={e => this.onChange(e)}></Input>
                        </div>
                        <div className="modal-input-wrapper">
                            <div className="key">封面图片</div>
                            <Upload
                                action='/common/upload'
                                withCredentials={true}
                                showUploadList={false}
                                onChange={(upload) => {
                                    if (upload.file.status === 'done' && upload.file.response.code === '1') {
                                        message.success('更新图片成功', .5);
                                        this.setState({
                                            _update: { ..._update, showCoverUrl: upload.file.response.content },
                                        });
                                    } else {
                                        message.success('更新图片失败，请重试');
                                    }
                                }}
                            >
                                <Button type='primary'>
                                    <Icon type='upload' />
                                    上传封面图片
                            </Button>
                            </Upload>
                            {
                                _update.showCoverUrl === '' ?
                                    null :
                                    <Button
                                        style={{ marginLeft: '1rem' }}
                                        onClick={() => {
                                            Modal.info({
                                                title: '预览封面图片',
                                                maskClosable: true,
                                                content: (
                                                    <div>
                                                        <img
                                                            style={{ width: '100%' }}
                                                            src={_update.showCoverUrl}
                                                            alt="预览封面图片"
                                                        />
                                                    </div>
                                                )
                                            })
                                        }}
                                    >
                                        预览
                                </Button>
                            }

                        </div>
                        <div className="modal-input-wrapper">
                            <div className="key">演出开始时间</div>
                            <DatePicker
                                defaultValue={moment(_update.startTime)}
                                onChange={(date, dateString) => {
                                    this.setState({ _update: { ..._update, startTimeDate: dateString, } });
                                }}
                            />
                            <TimePicker
                                defaultValue={moment(_update.startTime)}
                                format={TimeFormat}
                                style={{ marginLeft: '1rem' }}
                                onChange={(date, dateString) => {
                                    let _t = new Date(moment(this.state._update.startTimeDate + ' ' + dateString, 'YYYY-MM-DD hh:mm')).getTime();
                                    this.setState({ _update: { ..._update, startTime: _t } });
                                }}
                            />
                        </div>
                        <div className="modal-input-wrapper">
                            <div className="key">演出时长（分钟）</div>
                            <Input value={_update.singleShowDuration} data-target='_singleShowDuration' onChange={e => this.onChange(e)}></Input>
                        </div>
                        <div className="modal-input-wrapper">
                            <div className="key">售票开始时间</div>
                            <DatePicker
                                defaultValue={moment(_update.startSaleTime)}
                                onChange={(date, dateString) => {
                                    this.setState({ _update: { ..._update, startSaleTimeDate: dateString } });
                                }}
                            />
                            <TimePicker
                                defaultValue={moment(_update.startSaleTime)}
                                format={TimeFormat}
                                style={{ marginLeft: '1rem' }}
                                onChange={(date, dateString) => {
                                    let _t = new Date(moment(this.state._update.startSaleTimeDate + ' ' + dateString, 'YYYY-MM-DD hh:mm')).getTime();
                                    this.setState({ _update: { ..._update, startSaleTime: _t } });
                                }}
                            />
                        </div>
                        <div className="modal-input-wrapper">
                            <div className="key">结束售票时间</div>
                            <DatePicker
                                defaultValue={moment(_update.endSaleTime)}
                                onChange={(date, dateString) => {
                                    this.setState({ _update: { ..._update, endSaleTimeDate: dateString } });
                                }}
                            />
                            <TimePicker
                                defaultValue={moment(_update.endSaleTime)}
                                format={TimeFormat}
                                style={{ marginLeft: '1rem' }}
                                onChange={(date, dateString) => {
                                    let _t = new Date(moment(this.state._update.endSaleTimeDate + ' ' + dateString, 'YYYY-MM-DD hh:mm')).getTime();
                                    this.setState({ _update: { ..._update, endSaleTime: _t } });
                                }}
                            />
                        </div>
                        <div className="modal-input-wrapper" style={{ alignItems: 'flex-start' }}>
                            <div className="key" style={{ lineHeight: '32px' }}>介绍</div>
                            <TextArea value={_update.introduction} data-target='_introduction' onChange={e => this.onChange(e)}></TextArea>
                        </div>
                        <div className="modal-input-wrapper">
                            <div className="key">城市</div>
                            <Input value={_update.location} data-target='_location' onChange={e => this.onChange(e)}></Input>
                        </div>
                        <div className="modal-input-wrapper">
                            <div className="key">剧院</div>
                            <Input value={_update.theaterName} data-target='_theaterName' onChange={e => this.onChange(e)}></Input>
                        </div>
                        <div className="modal-input-wrapper">
                            <div className="key">地址</div>
                            <Input value={_update.address} data-target='_address' onChange={e => this.onChange(e)}></Input>
                        </div>
                        <div className="modal-input-wrapper" style={{ alignItems: 'flex-start' }}>
                            <div className="key" style={{ lineHeight: '32px' }}>产品列表</div>
                            <div style={{ flex: 1 }}>
                                <div className="row-input-wrapper">
                                    <div style={{ flex: 1, marginRight: '1rem' }}>区域名</div>
                                    <div style={{ flex: 1, marginRight: '1rem' }}>价格(人民币)</div>
                                    <div style={{ flex: 1, marginRight: '1rem' }}>票数</div>
                                    <Button type='danger' style={{ visibility: 'hidden' }}>
                                        <Icon type='delete' />
                                    </Button>
                                </div>
                                {
                                    _update.productInfoList ? _update.productInfoList.map((item, index) => (
                                        <div key={'_temp-div-' + index} className='row-input-wrapper'>
                                            <Input
                                                placeholder='区域名'
                                                value={item.showAreaName}
                                                data-target={'_' + index + '-showAreaName'}
                                                onChange={e => this.onChange(e)}
                                            />
                                            <Input
                                                placeholder='价格'
                                                value={+item.price / 100}
                                                style={{ marginLeft: '1rem' }}
                                                data-target={'_' + index + '-price'}
                                                onChange={e => this.onChange(e)}
                                            />
                                            <Input
                                                placeholder='票数'
                                                value={+item.stock}
                                                style={{ marginLeft: '1rem' }}
                                                data-target={'_' + index + '-stock'}
                                                onChange={e => this.onChange(e)}
                                            />
                                            <Button
                                                type='danger'
                                                style={{ marginLeft: '1rem', visibility: item.productId ? 'hidden' : 'visible' }}
                                                onClick={() => {
                                                    let _p = _update.productInfoList;
                                                    if (index === 0) {
                                                        _p = [..._p.slice(1)]
                                                    } else {
                                                        _p = [..._p.slice(0, index), ..._p.slice(index + 1)];
                                                    }
                                                    this.setState({
                                                        _update: { ..._update, productInfoList: _p },
                                                    });
                                                }}
                                            >
                                                <Icon type='delete' />
                                            </Button>
                                        </div>
                                    )) : null
                                }
                                <Button
                                    type='primary'
                                    onClick={() => {
                                        let _newRow = {
                                            showAreaName: '',
                                            price: 0,
                                            stock: 0,
                                        };
                                        let _p = _update.productInfoList;
                                        _p.push(_newRow);
                                        this.setState({
                                            _update: { ..._update, productInfoList: _p },
                                        });
                                    }}
                                >
                                    <Icon type='plus' /> 添加产品
                            </Button>
                            </div>
                        </div>
                    </Modal>
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
        updateStatus: state.Product.updateStatus,
        submitStatus: state.Product.submitStatus,
    }
}

export default connect(mstp)(ProductManage);