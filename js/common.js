var localStorageAvailable
try {
    window.localStorage.setItem("test", "test");
    window.localStorage.removeItem("test");
    localStorageAvailable = true
} catch (e) {
    localStorageAvailable = false
}

const common = {
    setCookie: (name, value, expires) => {
        if (localStorageAvailable) {
            localStorage.setItem(name,value)
        } else {
            let d = new Date()
            d.setTime(d.getTime() + (expires*24*60*60*1000))
            document.cookie = name + "=" + value + "; expires=" + d.toUTCString() + "; path=/"
        }
    },
    getCookie: (name) => {
        if (localStorageAvailable) {
            return localStorage.getItem(name)
        } else {
            var cookie = document.cookie
            cookie += ";"
            let start = cookie.indexOf(name + "=")
            if (start === -1) {
                return null
            }
            start += name.length + 1
            let end = cookie.indexOf(";", start)
            if (end === -1) {
                return null
            }
            return cookie.substring(start, end)
        }
    },
    getDefaultConfiguration: () => {
        // The default configuration is provided by the WordPress server via window.bbg_xiv.* variables.
        return {
            bbg_xiv_carousel_interval:                 bbg_xiv.bbg_xiv_carousel_interval,
            bbg_xiv_flex_min_width:                    bbg_xiv.bbg_xiv_flex_min_width,
            bbg_xiv_miro_row_height:                   bbg_xiv.bbg_xiv_miro_row_height,
            bbg_xiv_max_search_results:                bbg_xiv.bbg_xiv_max_search_results,
            bbg_xiv_flex_number_of_dense_view_columns: bbg_xiv.bbg_xiv_flex_number_of_dense_view_columns,
            bbg_xiv_flex_min_width_for_caption:        bbg_xiv.bbg_xiv_flex_min_width_for_caption,
            bbg_xiv_bandwidth:                         'auto',
            bbg_xiv_interface:                         bbg_xiv.bbg_xiv_interface
        }
    },
    getSrc: (data, fullSize, icon, bandwidth) => {
        switch (bandwidth) {
        case "normal":
            return data.source_url
        case "low":
            if (icon) {
                return data.bbg_thumbnail_src[0]
            } else {
                if (fullSize === "viewport") {
                    return data.bbg_large_src[0]
                } else {
                    return data.bbg_medium_large_src[0]
                }
            }
            break
        case "very low":
            if (icon) {
                return data.bbg_thumbnail_src[0]
            } else {
                if (fullSize === "viewport") {
                    return data.bbg_medium_large_src[0]
                } else {
                    return data.bbg_medium_src[0]
                }
            }
        }
    }
}

export default common
