import {
    combineReducers,
} from 'redux';

import {
    ACTION_CONST
} from './BLOG_CONST';

function Index(state, action) {
    switch (action.type) {
        case ACTION_CONST.ARTICLE.PUSH:
            {
                return {
                    ...state,
                    data: action.data,
                }
            }
        case ACTION_CONST.ARTICLE.STATUS_CHANGE:
            {
                return {
                    ...state,
                    status: action.status,
                    lastStatusUpdateTimeStamp: new Date().getTime(),
                }
            }
        default:
            {
                return {
                    data: [],
                    status: 'init',
                    lastStatusUpdateTimeStamp: 0,
                }
            }
    }
}

export default combineReducers({
    Index,
})