// Flex Container

import React from 'react'
import FlexItem from '../components/FlexItem.js'

export default props => {
    let collection = props.images
    let jsx        = [];
    collection.forEach(function(model) {
         jsx.push(FlexItem(model.attributes));        
    })
    console.log( 'FlexContainer():jsx=', jsx );
    return (
        <div class="bbg_xiv-container bbg_xiv-flex_container mc-rrr-jsx-container" data-bbg_xiv-gallery-id={collection.id}>
            {jsx}
            <div class="bbg_xiv-flex_footer"></div>
            <div class="bbg_xiv-dense_outer">
            </div>
            <div class="bbg_xiv-dense_inner">
              <button class="bbg_xiv-dense_close"><span class="glyphicon glyphicon-remove"></span></button>
              <h1 class="bbg_xiv-dense_title"></h1>
              <img class="img-rounded bbg_xiv-img_overlay" sizes={bbg_xiv.getSizes(null,'viewport',false)} />
              <h1 class="bbg_xiv-dense_caption"></h1>
            </div>
            <div class="bbg_xiv-dense_alt_inner">
                <span class="bbg_xiv-click_to_lock_comment">{bbg_xiv_lang['Click anywhere to lock the display of this popup.']}</span>
                <span>&nbsp;</span>
                <button class="bbg_xiv-dense_close"><span class="glyphicon glyphicon-remove"></span></button>
                <div class="bbg_xiv-dense_alt_items"></div>
            </div>
        </div>
    )
}

