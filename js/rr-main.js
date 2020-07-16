/*
    This program is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License
    as published by the Free Software Foundation; either version 2
    of the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

    Copyright 2015  Magenta Cuda
*/

// window.mcRrr is needed for now because we cannot import in the inline scripts of bbg_xiv-gallery.php
// window.mcRrr has references to the things that the inline scripts cannot import

import React from 'react'
import ReactDOM from 'react-dom'
import {createStore, applyMiddleware, compose} from 'redux'
import {connect} from 'react-redux'
import thunk from 'redux-thunk'
// TODO: BELOW FOR DEBUGGING ONLY
// import { createLogger } from 'redux-logger'
// TODO: ABOVE FOR DEBUGGING ONLY
import { Provider } from 'react-redux'
import reducer from './reducers/index.js'
import cookie from './middleware/cookie.js'
import rest from './middleware/rest.js'
import {setConfiguration, loadGalleryImages, setInitialized} from './actions/index.js'
import Frame from './containers/Frame.js'
import Configure from './containers/Configure.js'
import Overlay from './Overlay.js'
// TODO: BELOW FOR DEBUGGING ONLY
// import DevTools from './containers/DevTools.js'
// TODO: ABOVE FOR DEBUGGING ONLY

console.log('rr-main.js:loading...');

var searchParams = new URLSearchParams(window.location.search)
var debug        = searchParams.has("mc_debug")

window.mcRrr = {
    createStore: () => {
        // The configuration cannot be initialized in the call to createStore() as that will not synchronize the cookie to the Redux store.
        window.mcRrr.store = createStore(reducer, {galleries: {images: {}}, configuration: {}},
// TODO: BELOW FOR DEBUGGING ONLY
                                         // compose(applyMiddleware(thunk, start, rest, postRest, end, createLogger()), DevTools.instrument()))
// TODO: ABOVE FOR DEBUGGING ONLY
                                         applyMiddleware(thunk, cookie, rest))
        // The configuration needs to be initialized by dispatching a setConfiguration() action as that will sync the cookie to the Redux store.
        // If there is no cookie then the server provides a default configuration which needs to be pushed to a cookie.
        window.mcRrr.store.dispatch(setConfiguration({}))
    },
    loadGalleryImages: (id, images, home) => window.mcRrr.store.dispatch(loadGalleryImages(id, images, home)),
    createReactTree: (id, root) => {
        ReactDOM.render(
            <Provider store={window.mcRrr.store}>
                <Frame id={id} />
                <Configure />
            </Provider>,
            root
        )
    },
    createOverlay: (root, id = "", className = "") => {
        ReactDOM.render(<Overlay className={className} id={id} />, root)
    },
    getGallery: id => window.mcRrr.store.getState().galleries.images[id],
    setInitialized: id => window.mcRrr.store.dispatch(setInitialized(id)),
    debug: debug
}

console.log('rr-main.js:loaded.');
