import {
    combineReducers,
} from 'redux';

function Index(state, action) {
    switch (action.type) {
        default: {
            return {
                data: [],
            }
        }
    }
}

export default combineReducers({
    Index,
})