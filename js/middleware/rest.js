import {loadSearchImages, loadGalleryImages, handleLoadFailed, setStatus, STATUS_LOADING, STATUS_LOADED} from '../actions/index.js'
import {cache} from '../cache.js'

console.log("cache=", cache)

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
    if (typeof rest.specs !== 'undefined') {
        // This is a getImagesByGallerySpecs action
        const {id, specs} = rest
        const images      = cache.getImagesByGallerySpecs(specs)
        if (images) {
            return next(loadGalleryImages(id, images))
        } else {
            const ret    = next(setStatus(rest.id, STATUS_LOADING))
            const images = new wp.api.collections.Media()
            images.once("sync", function() {
                // the sync event will occur once only on the Backbone fetch of the collection
                cache.putImagesByGallerySpecs(specs, images)
                const nextRet = next(loadGalleryImages(id, images))
            });
            images.fetch({
                data:    specs,
                success: function(c, r, o) {
                },
                error:   function(c, r) {
                    next(handleLoadFailed(id, images, specs))
                }
            })
            console.log("%%%%%:REST: middleware:ret=", ret)
            return ret
        }
    } else if (typeof rest.parms !== 'undefined') {
        // This is a getImagesBySearchParms action
        const {id, parms} = rest
        const images      = cache.getImagesBySearchParms(parms)
        if (images) {
            return next(loadSearchImages(id, images, parms))
        } else {
            const ret    = next(setStatus(rest.id, STATUS_LOADING))
            const images = new wp.api.collections.Media()
            images.once("sync", function() {
                // the sync event will occur once only on the Backbone fetch of the collection
                cache.putImagesBySearchParms(parms, images)
                const nextRet = next(loadSearchImages(id, images, parms))
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
            return ret
        }
    }
}
