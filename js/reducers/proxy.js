// lightweight debugging wrapper for the Redux reducer

import {LOAD_GALLERY_IMAGES, LOAD_SEARCH_IMAGES, HANDLE_LOAD_FAILED, SET_VIEW, SET_STATUS, STATUS_LOADING, STATUS_LOADED,
        SET_CONTAINER_WIDTH, SET_CONFIGURATION, TOGGLE_FULL_SCREEN, TOGGLE_CAPTIONS, SET_QUERY} from '../actions/index.js'
import reducer from './index.js'

var count = 0;
export default (state = {}, action) => {
    console.log(`%%%%%%:reducer called[${++count}]:ACTION=`,action)
    const ret = reducer(state, action)
    console.log(`%%%%%%:reducer returned[${count}]:ACTION=`,action)
    return ret
}
