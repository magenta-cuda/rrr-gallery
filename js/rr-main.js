import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import {createStore, applyMiddleware, compose} from 'redux'
import { connect } from 'react-redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { Provider } from 'react-redux'
import reducer from './reducers/index.js'
import rest from './middleware/rest.js'
import Frame from './containers/Frame.js'
//import NavBar from './containers/NavBar.js'
import DevTools from './containers/DevTools.js'
import {getImagesByGallerySpecs, getImagesBySearchParms, loadGalleryImages, setView, toggleFullScreen, toggleCaptions,
        setConfiguration} from './actions/index.js'
import {CssReducer, JqueryProxy} from './CssReducer.js'

var searchParams = new URLSearchParams(window.location.search)
var debug        = searchParams.has("mc_debug")

debug && console.log("rr-main.js loading...")

const store = createStore(reducer, {galleries: {images: {}}, configuration: {}},
                          compose(applyMiddleware( thunk, rest, createLogger()), DevTools.instrument()))

// TODO: need store in global scope for now to do testing; remove for production.
// TODO: need actions in global scope for now as cannot import yet; remove for production.

window.mcRrr = {
    debug:                   debug,
    store:                   store,
    React:                   React,
    useState:                useState,
    useEffect:               useEffect,
    ReactDOM:                ReactDOM,
    connect:                 connect,
    Provider:                Provider,
    Frame:                   Frame,
//    NavBar:                  NavBar,
    setView:                 setView,
    toggleFullScreen:        toggleFullScreen,
    toggleCaptions:          toggleCaptions,
    loadGalleryImages:       loadGalleryImages,
    getImagesByGallerySpecs: getImagesByGallerySpecs,
    getImagesBySearchParms:  getImagesBySearchParms,
    setConfiguration:        setConfiguration,
    CssReducer:              new JqueryProxy().getCssReducer()
}

window.mcRrr.debug && console.log("rr-main.js loaded.")
