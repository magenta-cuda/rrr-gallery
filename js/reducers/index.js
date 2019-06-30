import {LOAD_IMAGES,HANDLE_LOAD_FAILED} from '../actions'

export default (state = {}, action) => {
    switch (action.type) {
    case LOAD_IMAGES:
        console.log('reducers:LOAD_IMAGES:action=', action)
        debugger
    case HANDLE_LOAD_FAILED:
    default:
        return state
    }
}
