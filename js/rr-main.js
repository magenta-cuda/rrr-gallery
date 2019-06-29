import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { Provider } from 'react-redux'
import reducer from './reducers'
import rest from './middleware/rest'
import DevTools from './containers/DevTools'

const store = createStore(reducer, {}, compose(applyMiddleware( thunk, rest, createLogger()), DevTools.instrument()))


