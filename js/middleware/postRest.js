import {LOAD_SEARCH_IMAGES, STATUS_LOADED, setStatus} from '../actions/index.js'

export default store => next => action => {
    console.log("%%%%%%:POSTREST middleware:action=", action)
    const ret = next(action)
    console.log("%%%%%%:POSTREST middleware:ret=", ret)
    // Since next() called asynchronously from rest.js apparently doesn't return try setting status here.
    if (ret.type === LOAD_SEARCH_IMAGES) {
        const nextRet = next(setStatus(ret.id, STATUS_LOADED))
        console.log("%%%%%%:POSTREST middleware:nextRet=", nextRet)
        // This next() call returns
    }
    return ret
}
