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
    // debugger
    if (typeof rest.specs !== 'undefined') {
        const {id, specs} = rest
        const images      = cache.getImagesByGallerySpecs(specs)
        if (images) {
            next(loadGalleryImages(id, images))
            const ret = next(setStatus(id, STATUS_LOADED))
            return ret
        } else {
            const ret    = next(setStatus(rest.id, STATUS_LOADING))
            const images = new wp.api.collections.Media()
            images.once("sync", function() {
                // the sync event will occur once only on the Backbone fetch of the collection
                cache.putImagesByGallerySpecs(specs, images)
                if (!mcRrr.useDispatchInsteadOfNext) {
                    const nextRet = next(loadGalleryImages(id, images))
                    console.log("%%%%%:REST: middleware:nextRet=", nextRet)
                    next(setStatus(id, STATUS_LOADED))
                } else {
                    const dispatchRet = store.dispatch(loadGalleryImages(id, images))
                    console.log("%%%%%:REST: middleware:dispatchRet=", dispatchRet)
                    store.dispatch(setStatus(id, STATUS_LOADED))
                }
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
        const {id, parms} = rest
        const ret = next(setStatus(rest.id, STATUS_LOADING))
        let images = new wp.api.collections.Media()
        images.once("sync", function() {
            // the sync event will occur once only on the Backbone fetch of the collection
            if (!mcRrr.useDispatchInsteadOfNext) {
                const nextRet = next(loadSearchImages(id, images, parms))
                console.log("%%%%%:REST: middleware:nextRet=", nextRet)
                next(setStatus(id, STATUS_LOADED))
            } else {
                const dispatchRet = store.dispatch(loadSearchImages(id, images, parms))
                console.log("%%%%%:REST: middleware:dispatchRet=", dispatchRet)
                store.dispatch(setStatus(id, STATUS_LOADED))
            }
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
