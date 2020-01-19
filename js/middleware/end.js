export default store => next => action => {
    console.log("%%%%%%:END middleware:action=", action)
    const ret = next(action)
    console.log("%%%%%%:END middleware:ret=", ret)
    return ret
}
