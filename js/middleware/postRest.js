import {LOAD_SEARCH_IMAGES, STATUS_LOADED, setStatus} from '../actions/index.js'

export default store => next => action => {
    console.log("%%%%%%:POSTREST middleware:action=", action)
    const ret = next(action)
    console.log("%%%%%%:POSTREST middleware:ret=", ret)
    return ret
}
