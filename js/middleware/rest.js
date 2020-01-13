import {loadSearchImages, loadGalleryImages, handleLoadFailed, setStatus, STATUS_LOADING, STATUS_LOADED} from '../actions/index.js'

export const REST = 'REST'

export default store => next => action => {
    const rest = action[REST]
    if (typeof rest === 'undefined') {
        return next(action)
    }
    window.mcRrr.debug && console.log('rest.js:action=', action)
    // debugger
    next(setStatus(rest.id, STATUS_LOADING))
    if (typeof rest.specs !== 'undefined') {
        const {id, specs} = rest
        const images = new wp.api.collections.Media()
        images.once("sync", function() {
            // the sync event will occur once only on the Backbone fetch of the collection
            next(loadGalleryImages(id, images))
            next(setStatus(id, STATUS_LOADED))
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
            next(setStatus(id, STATUS_LOADED))
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
}
