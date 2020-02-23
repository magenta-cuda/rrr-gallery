// Tabs Container Template

// N.B. TabsContainer uses the Backbone.js template 'script#bbg_xiv-template_tabs_tab'  from bbg_xiv-gallery_templates_wp_rest.php
// N.B. TabsContainer uses the Backbone.js template 'script#bbg_xiv-template_tabs_item' from bbg_xiv-gallery_templates_wp_rest.php

// This is an experiment using a hybrid component that uses a Backbone.View inside a React element.
// Unfortunately I think this needs React's dangerouslySetInnerHTML.
// TODO: Try to find a safer way.

import React from 'react';

export default class TabsContainer extends React.Component {
    constructor(props) {
        super(props)
        this.container       = null
        this.imagesContainer = null
        this.$imagesDom      = jQuery('<div class="tab-content" />')   // this.imagesDom is not in this.state as that may cause problems
    }
    static getDerivedStateFromError(error) {
        console.log('TabsContainer:', error)
        return {}
    }
    render() {
        const collection   = this.props.images
        // TODO: how to handle container.width()
        // var containerWidth=container.width();
        const tabView      = new bbg_xiv.ImageView()
        tabView.template   = _.template(jQuery("script#bbg_xiv-template_tabs_tab").html(),null,bbg_xiv.templateOptions)
        const imageView    = new bbg_xiv.ImageView()
        imageView.template = _.template(jQuery("script#bbg_xiv-template_tabs_item").html(),null,bbg_xiv.templateOptions)
        let tabsHtml = ""
        // let imagesHtml = ""
        const $imagesDom = this.$imagesDom
        collection.forEach(function(model, index) {
            model.attributes.browser = bbg_xiv.browser
            model.attributes.index   = index
            // model.attributes.bbg_xiv_container_width=containerWidth;
            imageView.model          = tabView.model = model
            tabsHtml                += tabView.render(true)
            // imagesHtml              += imageView.render(true)
            // I will attempt to avoid using React's dangerouslySetInnerHTML
            // by letting imageView.render() return a DOM element instead of HTML
            // N.B. this really isn't any safer as imageView.render() also works
            // by setting the inner HTML but it may be more obscure to someone
            // not familiar with Backbone
            // $imagesDom.append(imageView.render(false).$el.clone().children())
            $imagesDom.append(imageView.render(false).$el.children())
        })
        // TODO: handle translations for 'IMAGES:'
        // <li class="bbg_xiv-tabs_title"><a href="#"><?php _e( 'IMAGES:', 'bb_gallery' ); ?></a></li>
        tabsHtml   = {__html: '<li class="bbg_xiv-tabs_title"><a href="#">IMAGES:</a></li>' + tabsHtml}
        // imagesHtml = {__html: imagesHtml}

        return (
            <div className="bbg_xiv-container bbg_xiv-template_tabs_container" ref={node => {this.container = node}}>
                {/* Tabs */}
                <nav role="navigation" className="navbar navbar-default">
                <div className="navbar-header">
                    <button type="button" data-target={"#" + collection.id + "_tabbar_collapse"} data-toggle="collapse" className="navbar-toggle">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    {/* TODO: handle translations for 'IMAGES:' */}
                    {/* <a href="#" class="navbar-brand bbg_xiv-tabs_brand"><?php _e( 'IMAGES:', 'bb_gallery' ); ?></a> */}
                    <a href="#" className="navbar-brand bbg_xiv-tabs_brand">IMAGES:</a>
                </div>
                <div id={collection.id + "_tabbar_collapse"} className="collapse navbar-collapse bbg_xiv-closed">
                    <ul className="nav nav-tabs" dangerouslySetInnerHTML={tabsHtml} />
                </div>
                <span className="glyphicon glyphicon-collapse-down"></span>
                </nav>
                {/* Panes */}
                {/* <div className="tab-content" dangerouslySetInnerHTML={imagesHtml} /> */}
                <div className="tab-content" ref={node => {this.imagesContainer = node}} />
            </div>
        )
    }
    componentDidMount() {
        jQuery(this.imagesContainer).replaceWith(this.$imagesDom)
        window.bbg_xiv.postRenderTabs(this.container)
    }
    componentDidCatch(error, info) {
        console.log('TabsContainer:', error, info)
    }
}
