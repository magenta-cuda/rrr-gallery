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
    // the fullSize parameter is the size of the non-iconic view of the image and should either "viewport" or "container"
    // the icon parameter is a boolean indicating that the src is for a thumbnail
    // getSrc() sets the src attribute of <img> HTML elements which will be ignored on modern browsers that support the srcset attribute
    // i.e. the source selection logic of getSrc() will only be used on older browsers
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
    },
    getSrcset: (data, bandwidth) => data.bbg_srcset,
    getTitle: (data) => data.title.rendered.trim(),
    getCaption: (data, noAlt) => {
        let caption = jQuery(data.caption.rendered).text()
        if (!caption && !noAlt) {
            caption = common.getAlt(data, true)
        }
        return caption.trim()
    },
    getAlt: (data, noCaption) => {
        let alt = data.alt_text
        if (!alt && !noCaption) {
            alt = common.getCaption(data, true)
        }
        return alt.trim()
    },
    getPostContent: data => data.bbg_post_content ? data.bbg_post_content : bbg_xiv.getCaption(data),
    templateOptions: {
        // use WordPress templating syntax; see .../wp-includes/js/wp-util.js
        evaluate:    /<#([\s\S]+?)#>/g,
        interpolate: /\{\{\{([\s\S]+?)\}\}\}/g,
        escape:      /\{\{([^\}]+?)\}\}(?!\})/g,
        variable:    'data'
    },
    ImageView: Backbone.View.extend({
        render: function(srcOnly) {
            const html = this.template(this.model.attributes)
            if (srcOnly) {
                return html
            }
            this.$el.html(html)
            return this
        }
    })
}
export default common
