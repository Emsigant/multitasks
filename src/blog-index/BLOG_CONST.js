export const ACTION_CONST = {
    ARTICLE: {
        PUSH: 'AC1',
        STATUS_CHANGE: 'AC2',
    },
}

Array.prototype.fillWithNum = function fill(item, num) {
    let arr = this;
    for (let i = 0; i < num; i++) {
        arr.push(item instanceof Object ? {
            ...item,
            title: item.title + '-' + i,
        } : item);
    }
    return arr;
}

export const FAKE_FETCH = {
    fakeFetchArticle() {
        let arr = [];
        return arr.fillWithNum({
            title: 'article-title',
            date: '2018-06-09 18:45',
        }, 10);
    },
}