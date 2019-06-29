import {REST} from '../middleware/rest'

export const GET_IMAGES = 'GET-IMAGES'

export const getImages = attributes => ({
    [REST]:{
        attributes:attributes
    }
})

export const LOAD_IMAGES = 'LOAD-IMAGES'

export const loadImages = response => ({
    type:LOAD_IMAGES,
    response:response
})

