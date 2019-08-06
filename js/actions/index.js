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

export const LOAD_GALLERY_IMAGES = 'LOAD-GALLERY-IMAGES'

export const loadGalleryImages = (id, images) => ({
    type:   LOAD_GALLERY_IMAGES,
    id:     id,
    images: images
})

export const LOAD_SEARCH_IMAGES = 'LOAD-SEARCH-IMAGES'

export const loadSearchImages = (id, images, parms) => ({
    type:   LOAD_SEARCH_IMAGES,
    id:     id,
    images: images,
    parms:  parms
})

export const HANDLE_LOAD_FAILED = 'HANDLE-LOAD-FAILED'

export const handleLoadFailed = (id, images) => ({
    type:HANDLE_LOAD_FAILED,
    id:id,
    images:images
})

export const SET_VIEW = 'SET-VIEW'

export const setView = (id, view) => ({
    type: SET_VIEW,
    id:   id,
    view: view
})

export const SET_STATUS     = 'SET-STATUS'
export const STATUS_LOADING = 'loading'
export const STATUS_LOADED  = 'loaded'

export const setStatus = (id, status) => ({
    type:   SET_STATUS,
    id:     id,
    status: status
})

