import {REST} from '../middleware/rest.js'

export const getImagesByGallerySpecs = (id, specs) => ({
    [REST]:{
        id:id,
        specs:specs
    }
})

export const getImagesBySearchParms = (id, parms) => ({
    [REST]:{
        id:id,
        parms:parms
    }
})

export const LOAD_IMAGES = 'LOAD-IMAGES'

export const loadImages = (id, images) => ({
    type:LOAD_IMAGES,
    id:id,
    images:images
})

export const HANDLE_LOAD_FAILED = 'HANDLE-LOAD-FAILED'

export const handleLoadFailed = (id, images) => ({
    type:HANDLE_LOAD_FAILED,
    id:id,
    images:images
})
