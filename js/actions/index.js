import {REST} from '../middleware/rest.js'

export const getImagesByGallerySpecs = specs => ({
    [REST]:{
        specs:specs
    }
})

export const getImagesBySearchParms = parms => ({
    [REST]:{
        parms:parms
    }
})

export const LOAD_IMAGES = 'LOAD-IMAGES'

export const loadImages = response => ({
    type:LOAD_IMAGES,
    response:response
})

