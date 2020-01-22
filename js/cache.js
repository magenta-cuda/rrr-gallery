const cache = {

    imagesByGallerySpecs: {},
    imagesBySearchParms:  {},

    putImagesByGallerySpecs: (specs, images) => {
        const key = JSON.stringify(specs)
        cache.imagesByGallerySpecs[key] = images
        console.log("putImagesByGallerySpecs():cache=", cache)
    },

    putImagesBySearchParms: (parms, images) => {
        const key = JSON.stringify(parms)
        cache.imagesBySearchParms[key] = images
        console.log("putImagesBySearchParms():cache=", cache)
    },

    getImagesByGallerySpecs: (specs) => {
        const key    = JSON.stringify(specs)
        const images = cache.imagesByGallerySpecs[key]
        console.log("getImagesByGallerySpecs():images=", images)
        return images
    },

    getImagesBySearchParms: (parms) => {
        const key    = JSON.stringify(parms)
        const images = imagesBySearchParms[key]
        console.log("getImagesBySearchParms():images=", images)
        return images
    }

}

export {cache}

