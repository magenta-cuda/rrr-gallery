import {loadImages, handleLoadFailed} from '../actions/index.js'

export const REST = 'REST'

export default store => next => action => {
    const rest = action[REST]
    if (typeof rest === 'undefined') {
        return next(action)
    }
    console.log('rest.js:action=', action)
    // debugger
    if (typeof rest.specs !== 'undefined') {
    } else if (typeof rest.parms !== 'undefined') {
        var id     = rest.id
        var images = new wp.api.collections.Media()
        images.once("sync", function() {
            // the sync event will occur once only on the Backbone fetch of the collection
            next(loadImages(id, images));
        });
        // get the next part of the multi-part search result as specified by page
        images.fetch({
            data:rest.parms,
            success:function(c, r, o) {
            },
            error:function(c, r) {
                next(handleLoadFailed(id, images));
            }
        })
    }
}
