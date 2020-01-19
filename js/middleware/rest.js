import {loadSearchImages, loadGalleryImages, handleLoadFailed, setStatus, STATUS_LOADING, STATUS_LOADED} from '../actions/index.js'

export const REST = 'REST'

export default store => next => action => {
    console.log("%%%%%:REST: middleware:action=", action)
    const rest = action[REST]
    if (typeof rest === 'undefined') {
        const ret = next(action)
        console.log("%%%%%:REST: middleware:ret=", ret)
        return ret
    }
    // window.mcRrr.debug && console.log('rest.js:action=', action)
    // debugger
    const ret = next(setStatus(rest.id, STATUS_LOADING))
    console.log("%%%%%:REST: middleware:ret=", ret)
    if (typeof rest.specs !== 'undefined') {
        const {id, specs} = rest
        const images = new wp.api.collections.Media()
        images.once("sync", function() {
            // the sync event will occur once only on the Backbone fetch of the collection
            const nextret = next(loadGalleryImages(id, images))
            console.log("%%%%%:REST: middleware:nextret=", nextret)
            // Apparently, the above call to next() doesn't return. So, we cannot do the following.
            // next(setStatus(rest.id, STATUS_LOADED))
            // So, apparently we cannot dispatch multiple actions via next() in an asynchronous callback.
            // See postRest.js for a workaround.
        });
        images.fetch({
            data:    specs,
            success: function(c, r, o) {
            },
            error:   function(c, r) {
                next(handleLoadFailed(id, images, specs))
            }
        })
    } else if (typeof rest.parms !== 'undefined') {
        let id     = rest.id
        let parms  = rest.parms
        let images = new wp.api.collections.Media()
        images.once("sync", function() {
            // the sync event will occur once only on the Backbone fetch of the collection
            next(loadSearchImages(id, images, parms))
        })
        // get the next part of the multi-part search result as specified by page
        images.fetch({
            data:{
                search:   parms.query,
                page:     parms.page,
                per_page: parms.searchLimit
            },
            success:function(c, r, o) {
            },
            error:function(c, r) {
                next(handleLoadFailed(id, images, parms))
            }
        })
    }
    return ret
}
