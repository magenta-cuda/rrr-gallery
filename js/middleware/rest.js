export const REST = 'REST'

export default store => next => action => {
    const rest = action['REST']
    if (typeof rest === 'undefined') {
        return next(action)
    }
}
