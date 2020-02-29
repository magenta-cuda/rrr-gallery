// Since configuration is per user it needs to be persisted on the client side in a cookie or in local storage

import {SET_CONFIGURATION} from '../actions/index.js'

export default store => next => action => {
    if (action.type === SET_CONFIGURATION) {
        let cookie = bbg_xiv.getCookie("bbg_xiv")
        cookie = cookie ? JSON.parse(cookie) : {}
        cookie = Object.assign(cookie, action.configuration)
        delete cookie.show
        cookie = JSON.stringify(cookie)
        bbg_xiv.setCookie("bbg_xiv", cookie, 30)
    }
    const ret = next(action)
    return ret
}
