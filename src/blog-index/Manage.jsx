import React, { Component } from 'react';
import redux from 'redux';

class Manage extends Component {
    render() {
        return (
            <div className='simple-anchor-list'>
                <a href="/addNewArticle">添加新文章</a>
                <a href="/manage">管理文章</a>
                <a href="/search">搜索</a>
                <a href="/react">react page</a>
                <a href="/goTest">test</a>
            </div>
        )
    }
}

export default Manage;