import React from 'react'
import ReactDOM from 'react-dom'
import {createStore, applyMiddleware, compose} from 'redux'
import { connect } from 'react-redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { Provider } from 'react-redux'
import reducer from './reducers/index.js'
import rest from './middleware/rest.js'
import Frame from './components/Frame.js'
//import NavBar from './containers/NavBar.js'
import DevTools from './containers/DevTools.js'
import {getImagesByGallerySpecs, getImagesBySearchParms, loadGalleryImages, setView} from './actions/index.js'

console.log( 'rr-main.js loading...' )

const store = createStore(reducer, {images: {}, view: 'Gallery'}, compose(applyMiddleware( thunk, rest, createLogger()), DevTools.instrument()))

// TODO: need store in global scope for now to do testing; remove for production.
// TODO: need actions in global scope for now as cannot import yet; remove for production.

window.mcRrr = {
    store:                   store,
    React:                   React,
    ReactDOM:                ReactDOM,
    connect:                 connect,
    Provider:                Provider,
    Frame:                   Frame,
//    NavBar:                  NavBar,
    setView:                 setView,
    loadGalleryImages:       loadGalleryImages,
    getImagesByGallerySpecs: getImagesByGallerySpecs,
    getImagesBySearchParms:  getImagesBySearchParms
}
console.log( 'rr-main.js loaded.' )
