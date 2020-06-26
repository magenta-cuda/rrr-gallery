const common = {
    getSrc: ( data, fullSize, icon, bandwidth ) => {
        switch ( bandwidth ) {
        case "normal":
            return data.source_url;
        case "low":
            if(icon){
                return data.bbg_thumbnail_src[0];
            }else{
                if(fullSize==="viewport"){
                    return data.bbg_large_src[0];
                }else{
                    return data.bbg_medium_large_src[0];
                }
            }
            break;
        case "very low":
            if(icon){
                return data.bbg_thumbnail_src[0];
            }else{
                if(fullSize==="viewport"){
                    return data.bbg_medium_large_src[0];
                }else{
                    return data.bbg_medium_src[0];
                }
            }
        }
    }
}

export default common
