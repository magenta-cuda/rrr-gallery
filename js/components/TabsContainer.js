// Tabs Container Template

// This is an experiment using a hybrid component that uses a Backbone.View inside a React element.
// Unfortunately I think this needs React's dangerouslySetInnerHTML.
// TODO: Try to find a safer way.

// TODO: webpack into bundle.js

// import React from 'react';

// export default props => (

const TabsContainer = props => {
    const collection = props.images

    // TODO: how to handle container.width()
    // var containerWidth=container.width();
    const tabView      = new bbg_xiv.ImageView()
    tabView.template   = _.template(jQuery("script#bbg_xiv-template_tabs_tab").html(),null,bbg_xiv.templateOptions)
    const imageView    = new bbg_xiv.ImageView()
    imageView.template = _.template(jQuery("script#bbg_xiv-template_tabs_item").html(),null,bbg_xiv.templateOptions)
    let tabsHtml       = ""
    let imagesHtml     = ""
    collection.forEach(function(model,index) {
        model.attributes.browser = bbg_xiv.browser
        model.attributes.index   = index
        // model.attributes.bbg_xiv_container_width=containerWidth;
        imageView.model          = tabView.model=model
        tabsHtml                += tabView.render(true)
        imagesHtml              += imageView.render(true)
    })
    {/* TODO: handle translations for 'IMAGES:' */}
    {/* <li class="bbg_xiv-tabs_title"><a href="#"><?php _e( 'IMAGES:', 'bb_gallery' ); ?></a></li> */}
    tabsHtml   = {__html: '<li class="bbg_xiv-tabs_title"><a href="#">IMAGES:</a></li>' + tabsHtml}
    imagesHtml = {__html: imagesHtml}

    return (
        <div class="bbg_xiv-container bbg_xiv-template_tabs_container">
            {/* Tabs */}
            <nav role="navigation" class="navbar navbar-default">
            <div class="navbar-header">
                <button type="button" data-target={"#" + collection.id + "_tabbar_collapse"} data-toggle="collapse" class="navbar-toggle">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                {/* TODO: handle translations for 'IMAGES:' */}
                {/* <a href="#" class="navbar-brand bbg_xiv-tabs_brand"><?php _e( 'IMAGES:', 'bb_gallery' ); ?></a> */}
                <a href="#" class="navbar-brand bbg_xiv-tabs_brand">'IMAGES:</a>
            </div>
            <div id={collection.id + "_tabbar_collapse"} class="collapse navbar-collapse bbg_xiv-closed">
                <ul class="nav nav-tabs" dangerouslySetInnerHTML={tabsHtml} />
            </div>
            <span class="glyphicon glyphicon-collapse-down"></span>
            </nav>
            {/* Panes */}
            <div class="tab-content" dangerouslySetInnerHTML={imagesHtml} />
        </div>
    )
}
