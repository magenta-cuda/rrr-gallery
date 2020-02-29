import {SET_CONFIGURATION} from '../actions/index.js'

export default store => next => action => {
    console.log("%%%%%:middleware:SET_CONFIGURATION::action=", action)
    if (action.type === SET_CONFIGURATION) {
        let cookie = bbg_xiv.getCookie("bbg_xiv")
        cookie = cookie ? JSON.parse(cookie) : {}
        cookie = Object.assign(cookie, action.configuration) 
        cookie = JSON.stringify(cookie)
        console.log("%%%%%:middleware:SET_CONFIGURATION::cookie=", cookie)
        bbg_xiv.setCookie("bbg_xiv", cookie, 30)
    }
    const ret = next(action)
    console.log("%%%%%:middleware:SET_CONFIGURATION::ret=", ret)
    return ret
}
