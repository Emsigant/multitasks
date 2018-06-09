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
                }
            }
        default:
            {
                return {
                    data: [],
                    status: 'init',
                }
            }
    }
}

export default combineReducers({
    Index,
})