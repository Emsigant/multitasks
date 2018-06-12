import {
    FAKE_FETCH,
    ACTION_CONST,
} from './BLOG_CONST';

const MODE = 'dev';

function FetchArticleStatusChange(status) {
    return {
        type: ACTION_CONST.ARTICLE.STATUS_CHANGE,
        status,
    }
}

function PushArticleToStore(data) {
    return {
        type: ACTION_CONST.ARTICLE.PUSH,
        data,
    }
}

export function FetchArticleList(pageNo = 1, PageSize = 10) {
    return (dispatch, getState) => {
        if (MODE === 'dev') {
            dispatch(FetchArticleStatusChange('pending'));
            setTimeout(() => {
                dispatch(PushArticleToStore(FAKE_FETCH.fakeFetchArticle()));
                dispatch(FetchArticleStatusChange('resolved'));
            }, 300);
        } else {
            dispatch(FetchArticleStatusChange('pending'));
            fetch('/getAll')
                .then(res => res.json())
                .then(res => {
                    dispatch(PushArticleToStore(res));
                    dispatch(FetchArticleStatusChange('resolved'));
                })
                .catch(e => {
                    dispatch(FetchArticleStatusChange('reject'));
                });
        }
    }
}