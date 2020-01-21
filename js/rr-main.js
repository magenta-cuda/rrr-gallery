import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import {createStore, applyMiddleware, compose} from 'redux'
import { connect } from 'react-redux'
import thunk from 'redux-thunk'
// import { createLogger } from 'redux-logger'
import { Provider } from 'react-redux'
// import reducer from './reducers/index.js'
// proxy.js is a lightweight debugging wrapper for the Redux reducer
import reducer from './reducers/proxy.js'
import start from './middleware/start.js'
import rest from './middleware/rest.js'
import postRest from './middleware/postRest.js'
import end from './middleware/end.js'
import Frame from './containers/Frame.js'
// import NavBar from './containers/NavBar.js'
// import DevTools from './containers/DevTools.js'
import {getImagesByGallerySpecs, getImagesBySearchParms, loadGalleryImages, setView, setGallery, toggleFullScreen, toggleCaptions,
        setQuery, setConfiguration} from './actions/index.js'
import {CssReducer, JqueryProxy} from './CssReducer.js'

var searchParams = new URLSearchParams(window.location.search)
var debug        = searchParams.has("mc_debug")

debug && console.log("rr-main.js loading...")

const store = createStore(reducer, {galleries: {images: {}}, configuration: {}},
                          // compose(applyMiddleware(thunk, start, rest, postRest, end, createLogger()), DevTools.instrument()))
                          applyMiddleware(thunk, start, rest, postRest, end))

// TODO: need store in global scope for now to do testing; remove for production.
// TODO: need actions in global scope for now as cannot import yet; remove for production.

window.mcRrr = {
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
    setConfiguration:         setConfiguration,
    CssReducer:               new JqueryProxy().getCssReducer(),
    useDispatchInsteadOfNext: false   // for use in asynchronous callbacks in Redux middleware - experimental
}

window.mcRrr.debug && console.log("rr-main.js loaded.")
