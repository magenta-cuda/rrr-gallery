// window.mcRrr is needed for now because we cannot import in the inline scripts of bbg_xiv-gallery.php
// window.mcRrr has references to the things that the inline scripts cannot import

import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import {createStore, applyMiddleware, compose} from 'redux'
import { connect } from 'react-redux'
import thunk from 'redux-thunk'
// TODO: BELOW FOR DEBUGGING ONLY
// import { createLogger } from 'redux-logger'
// TODO: ABOVE FOR DEBUGGING ONLY
import { Provider } from 'react-redux'
import {LOAD_GALLERY_IMAGES, LOAD_SEARCH_IMAGES, HANDLE_LOAD_FAILED, SET_VIEW, SET_GALLERY, SET_STATUS, STATUS_LOADING,
        STATUS_LOADED, SET_CONTAINER_WIDTH, SET_CONFIGURATION, TOGGLE_FULL_SCREEN, TOGGLE_CAPTIONS, SET_QUERY}
        from './actions/index.js'
import {REST} from './middleware/rest.js'
import reducer from './reducers/index.js'
import rest from './middleware/rest.js'
import Frame from './containers/Frame.js'
// import NavBar from './containers/NavBar.js'
// TODO: BELOW FOR DEBUGGING ONLY
// import DevTools from './containers/DevTools.js'
// TODO: ABOVE FOR DEBUGGING ONLY
import {getImagesByGallerySpecs, getImagesBySearchParms, loadGalleryImages, setView, setGallery, toggleFullScreen, toggleCaptions,
        setQuery, setConfiguration} from './actions/index.js'

var searchParams = new URLSearchParams(window.location.search)
var debug        = searchParams.has("mc_debug")

debug && console.log("rr-main.js loading...")

window.mcRrr = {}

const store = createStore(reducer, {galleries: {images: {}}, configuration: {}},
// TODO: BELOW FOR DEBUGGING ONLY
                          // compose(applyMiddleware(thunk, start, rest, postRest, end, createLogger()), DevTools.instrument()))
// TODO: ABOVE FOR DEBUGGING ONLY
                          applyMiddleware(thunk, rest))

// TODO: need store in global scope for now to do testing; remove for production.
// TODO: need actions in global scope for now as cannot import yet; remove for production.

Object.assign(window.mcRrr, {
    debug:                    debug,
    store:                    store,
    React:                    React,
    useState:                 useState,
    useEffect:                useEffect,
    ReactDOM:                 ReactDOM,
    connect:                  connect,
    Provider:                 Provider,
    Frame:                    Frame,
//    NavBar:                  NavBar,
    setView:                  setView,
    setGallery:               setGallery,
    toggleFullScreen:         toggleFullScreen,
    toggleCaptions:           toggleCaptions,
    setQuery:                 setQuery,
    loadGalleryImages:        loadGalleryImages,
    getImagesByGallerySpecs:  getImagesByGallerySpecs,
    getImagesBySearchParms:   getImagesBySearchParms,
    setConfiguration:         setConfiguration
})

window.mcRrr.debug && console.log("rr-main.js loaded.")
