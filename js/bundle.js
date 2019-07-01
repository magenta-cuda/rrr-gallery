/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"main": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push(["./rr-main.js","vendors~main"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./actions/index.js":
/*!**************************!*\
  !*** ./actions/index.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\nexports.handleLoadFailed = exports.HANDLE_LOAD_FAILED = exports.loadImages = exports.LOAD_IMAGES = exports.getImagesBySearchParms = exports.getImagesByGallerySpecs = undefined;\n\nvar _rest = __webpack_require__(/*! ../middleware/rest.js */ \"./middleware/rest.js\");\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nvar getImagesByGallerySpecs = exports.getImagesByGallerySpecs = function getImagesByGallerySpecs(id, specs) {\n    return _defineProperty({}, _rest.REST, {\n        id: id,\n        specs: specs\n    });\n};\n\nvar getImagesBySearchParms = exports.getImagesBySearchParms = function getImagesBySearchParms(id, parms) {\n    return _defineProperty({}, _rest.REST, {\n        id: id,\n        parms: parms\n    });\n};\n\nvar LOAD_IMAGES = exports.LOAD_IMAGES = 'LOAD-IMAGES';\n\nvar loadImages = exports.loadImages = function loadImages(id, images, parms) {\n    return {\n        type: LOAD_IMAGES,\n        id: id,\n        images: images,\n        parms: parms\n    };\n};\n\nvar HANDLE_LOAD_FAILED = exports.HANDLE_LOAD_FAILED = 'HANDLE-LOAD-FAILED';\n\nvar handleLoadFailed = exports.handleLoadFailed = function handleLoadFailed(id, images) {\n    return {\n        type: HANDLE_LOAD_FAILED,\n        id: id,\n        images: images\n    };\n};\n\n//# sourceURL=webpack:///./actions/index.js?");

/***/ }),

/***/ "./components/FlexContainer.js":
/*!*************************************!*\
  !*** ./components/FlexContainer.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _react = __webpack_require__(/*! react */ \"../node_modules/react/index.js\");\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _FlexItem = __webpack_require__(/*! ../components/FlexItem.js */ \"./components/FlexItem.js\");\n\nvar _FlexItem2 = _interopRequireDefault(_FlexItem);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n// Flex Container\n\nexports.default = function (props) {\n    var collection = props.images;\n    var jsx = [];\n    collection.forEach(function (model) {\n        jsx.push((0, _FlexItem2.default)(model.attributes));\n    });\n    console.log('FlexContainer():jsx=', jsx);\n    return _react2.default.createElement(\n        'div',\n        { 'class': 'bbg_xiv-container bbg_xiv-flex_container mc-rrr-jsx-container', 'data-bbg_xiv-gallery-id': collection.id },\n        jsx,\n        _react2.default.createElement('div', { 'class': 'bbg_xiv-flex_footer' }),\n        _react2.default.createElement('div', { 'class': 'bbg_xiv-dense_outer' }),\n        _react2.default.createElement(\n            'div',\n            { 'class': 'bbg_xiv-dense_inner' },\n            _react2.default.createElement(\n                'button',\n                { 'class': 'bbg_xiv-dense_close' },\n                _react2.default.createElement('span', { 'class': 'glyphicon glyphicon-remove' })\n            ),\n            _react2.default.createElement('h1', { 'class': 'bbg_xiv-dense_title' }),\n            _react2.default.createElement('img', { 'class': 'img-rounded bbg_xiv-img_overlay', sizes: bbg_xiv.getSizes(null, 'viewport', false) }),\n            _react2.default.createElement('h1', { 'class': 'bbg_xiv-dense_caption' })\n        ),\n        _react2.default.createElement(\n            'div',\n            { 'class': 'bbg_xiv-dense_alt_inner' },\n            _react2.default.createElement(\n                'span',\n                { 'class': 'bbg_xiv-click_to_lock_comment' },\n                bbg_xiv_lang['Click anywhere to lock the display of this popup.']\n            ),\n            _react2.default.createElement(\n                'span',\n                null,\n                '\\xA0'\n            ),\n            _react2.default.createElement(\n                'button',\n                { 'class': 'bbg_xiv-dense_close' },\n                _react2.default.createElement('span', { 'class': 'glyphicon glyphicon-remove' })\n            ),\n            _react2.default.createElement('div', { 'class': 'bbg_xiv-dense_alt_items' })\n        )\n    );\n};\n\n//# sourceURL=webpack:///./components/FlexContainer.js?");

/***/ }),

/***/ "./components/FlexItem.js":
/*!********************************!*\
  !*** ./components/FlexItem.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _react = __webpack_require__(/*! react */ \"../node_modules/react/index.js\");\n\nvar _react2 = _interopRequireDefault(_react);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nexports.default = function (data) {\n    var className = '';\n    var dataGalleryIndex = '';\n    if (typeof data.gallery_index !== 'undefined') {\n        className = 'bbg_xiv-gallery_icon';\n        dataGalleryIndex = data.gallery_index;\n    }\n    return _react2.default.createElement(\n        'div',\n        { 'class': 'bbg_xiv-flex_item' },\n        _react2.default.createElement(\n            'figure',\n            null,\n            _react2.default.createElement(\n                'figcaption',\n                null,\n                bbg_xiv.getTitle(data)\n            ),\n            _react2.default.createElement(\n                'a',\n                { href: data.link, target: '_blank', className: className, dataGalleryIndex: dataGalleryIndex },\n                _react2.default.createElement('img', { src: bbg_xiv.getSrc(data, 'viewport', true), srcset: bbg_xiv.getSrcset(data), sizes: bbg_xiv.getSizes(data, 'viewport', true),\n                    alt: bbg_xiv.getAlt(data), title: bbg_xiv.getTitle(data), dataBbgXivImageId: data.id })\n            )\n        ),\n        _react2.default.createElement(\n            'a',\n            { href: data.link, target: '_blank', className: className, dataGalleryIndex: dataGalleryIndex },\n            _react2.default.createElement(\n                'div',\n                { 'class': 'bbg_xiv-dense_full_btn', title: bbg_xiv.getCaption(data) },\n                _react2.default.createElement(\n                    'button',\n                    { 'class': 'bbg_xiv-dense_alt_btn bbg_xiv-flex_from_image btn' },\n                    _react2.default.createElement('span', { 'class': 'glyphicon glyphicon-info-sign' })\n                ),\n                _react2.default.createElement(\n                    'button',\n                    { 'class': 'bbg_xiv-dense_full_btn bbg_xiv-flex_from_image btn' },\n                    _react2.default.createElement('span', { 'class': 'glyphicon glyphicon-fullscreen' })\n                )\n            )\n        )\n    );\n}; // Flex Item Template\n\n//# sourceURL=webpack:///./components/FlexItem.js?");

/***/ }),

/***/ "./components/Frame.js":
/*!*****************************!*\
  !*** ./components/Frame.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _react = __webpack_require__(/*! react */ \"../node_modules/react/index.js\");\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _Gallery = __webpack_require__(/*! ../containers/Gallery.js */ \"./containers/Gallery.js\");\n\nvar _Gallery2 = _interopRequireDefault(_Gallery);\n\nvar _DevTools = __webpack_require__(/*! ../containers/DevTools.js */ \"./containers/DevTools.js\");\n\nvar _DevTools2 = _interopRequireDefault(_DevTools);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nexports.default = function () {\n    return _react2.default.createElement(\n        'div',\n        null,\n        _react2.default.createElement(_Gallery2.default, null),\n        _react2.default.createElement(_DevTools2.default, null)\n    );\n};\n\n//# sourceURL=webpack:///./components/Frame.js?");

/***/ }),

/***/ "./components/Gallery.js":
/*!*******************************!*\
  !*** ./components/Gallery.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _react = __webpack_require__(/*! react */ \"../node_modules/react/index.js\");\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _FlexContainer = __webpack_require__(/*! ../components/FlexContainer.js */ \"./components/FlexContainer.js\");\n\nvar _FlexContainer2 = _interopRequireDefault(_FlexContainer);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nexports.default = function (props) {\n    console.log('Gallery.js:props=', props);\n    debugger;\n    return _react2.default.createElement(\n        'div',\n        null,\n        'TODO: show FlexContainer'\n    )\n    // <FlexContainer images={props.images}></FlexContainer>\n    ;\n};\n\n//# sourceURL=webpack:///./components/Gallery.js?");

/***/ }),

/***/ "./containers/DevTools.js":
/*!********************************!*\
  !*** ./containers/DevTools.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _react = __webpack_require__(/*! react */ \"../node_modules/react/index.js\");\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _reduxDevtools = __webpack_require__(/*! redux-devtools */ \"../node_modules/redux-devtools/lib/index.js\");\n\nvar _reduxDevtoolsLogMonitor = __webpack_require__(/*! redux-devtools-log-monitor */ \"../node_modules/redux-devtools-log-monitor/lib/index.js\");\n\nvar _reduxDevtoolsLogMonitor2 = _interopRequireDefault(_reduxDevtoolsLogMonitor);\n\nvar _reduxDevtoolsDockMonitor = __webpack_require__(/*! redux-devtools-dock-monitor */ \"../node_modules/redux-devtools-dock-monitor/lib/index.js\");\n\nvar _reduxDevtoolsDockMonitor2 = _interopRequireDefault(_reduxDevtoolsDockMonitor);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nexports.default = (0, _reduxDevtools.createDevTools)(_react2.default.createElement(\n  _reduxDevtoolsDockMonitor2.default,\n  { toggleVisibilityKey: 'ctrl-h', changePositionKey: 'ctrl-w' },\n  _react2.default.createElement(_reduxDevtoolsLogMonitor2.default, null)\n));\n\n//# sourceURL=webpack:///./containers/DevTools.js?");

/***/ }),

/***/ "./containers/Gallery.js":
/*!*******************************!*\
  !*** ./containers/Gallery.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _reactRedux = __webpack_require__(/*! react-redux */ \"../node_modules/react-redux/es/index.js\");\n\nvar _Gallery = __webpack_require__(/*! ../components/Gallery */ \"./components/Gallery.js\");\n\nvar _Gallery2 = _interopRequireDefault(_Gallery);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar mapStateToProps = function mapStateToProps(state) {\n    return { images: state.images[state.id] };\n};\n\nexports.default = (0, _reactRedux.connect)(mapStateToProps)(_Gallery2.default);\n\n//# sourceURL=webpack:///./containers/Gallery.js?");

/***/ }),

/***/ "./middleware/rest.js":
/*!****************************!*\
  !*** ./middleware/rest.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\nexports.REST = undefined;\n\nvar _index = __webpack_require__(/*! ../actions/index.js */ \"./actions/index.js\");\n\nvar REST = exports.REST = 'REST';\n\nexports.default = function (store) {\n    return function (next) {\n        return function (action) {\n            var rest = action[REST];\n            if (typeof rest === 'undefined') {\n                return next(action);\n            }\n            console.log('rest.js:action=', action);\n            debugger;\n            if (typeof rest.specs !== 'undefined') {} else if (typeof rest.parms !== 'undefined') {\n                var id = rest.id;\n                var parms = rest.parms;\n                var images = new wp.api.collections.Media();\n                images.once(\"sync\", function () {\n                    // the sync event will occur once only on the Backbone fetch of the collection\n                    next((0, _index.loadImages)(id, images, parms));\n                });\n                // get the next part of the multi-part search result as specified by page\n                images.fetch({\n                    data: {\n                        search: parms.query,\n                        page: parms.page,\n                        per_page: parms.searchLimit\n                    },\n                    success: function success(c, r, o) {},\n                    error: function error(c, r) {\n                        next((0, _index.handleLoadFailed)(id, images, parms));\n                    }\n                });\n            }\n        };\n    };\n};\n\n//# sourceURL=webpack:///./middleware/rest.js?");

/***/ }),

/***/ "./reducers/index.js":
/*!***************************!*\
  !*** ./reducers/index.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _actions = __webpack_require__(/*! ../actions */ \"./actions/index.js\");\n\nexports.default = function () {\n    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};\n    var action = arguments[1];\n\n    switch (action.type) {\n        case _actions.LOAD_IMAGES:\n            console.log('reducers:LOAD_IMAGES:action=', action);\n            debugger;\n            window.bbg_xiv.images[action.id] = action.images;\n            // TODO:  For now directly call the renderer - it should be indirectly called from a Redux container after its props changes.\n            window.bbg_xiv.handleSearchResponse(!!action.images.length, action.parms);\n            // TODO: state should contain window.bbg_xiv.images[] and handleSearchResponse() should be called from a render() function\n            //       for a Redux container of the gallery.\n            return state;\n        case _actions.HANDLE_LOAD_FAILED:\n        default:\n            return state;\n    }\n};\n\n//# sourceURL=webpack:///./reducers/index.js?");

/***/ }),

/***/ "./rr-main.js":
/*!********************!*\
  !*** ./rr-main.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _react = __webpack_require__(/*! react */ \"../node_modules/react/index.js\");\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _reactDom = __webpack_require__(/*! react-dom */ \"../node_modules/react-dom/index.js\");\n\nvar _reactDom2 = _interopRequireDefault(_reactDom);\n\nvar _redux = __webpack_require__(/*! redux */ \"../node_modules/redux/es/redux.js\");\n\nvar _reduxThunk = __webpack_require__(/*! redux-thunk */ \"../node_modules/redux-thunk/es/index.js\");\n\nvar _reduxThunk2 = _interopRequireDefault(_reduxThunk);\n\nvar _reduxLogger = __webpack_require__(/*! redux-logger */ \"../node_modules/redux-logger/dist/redux-logger.js\");\n\nvar _reactRedux = __webpack_require__(/*! react-redux */ \"../node_modules/react-redux/es/index.js\");\n\nvar _index = __webpack_require__(/*! ./reducers/index.js */ \"./reducers/index.js\");\n\nvar _index2 = _interopRequireDefault(_index);\n\nvar _rest = __webpack_require__(/*! ./middleware/rest.js */ \"./middleware/rest.js\");\n\nvar _rest2 = _interopRequireDefault(_rest);\n\nvar _Frame = __webpack_require__(/*! ./components/Frame.js */ \"./components/Frame.js\");\n\nvar _Frame2 = _interopRequireDefault(_Frame);\n\nvar _FlexContainer = __webpack_require__(/*! ./components/FlexContainer.js */ \"./components/FlexContainer.js\");\n\nvar _FlexContainer2 = _interopRequireDefault(_FlexContainer);\n\nvar _DevTools = __webpack_require__(/*! ./containers/DevTools.js */ \"./containers/DevTools.js\");\n\nvar _DevTools2 = _interopRequireDefault(_DevTools);\n\nvar _index3 = __webpack_require__(/*! ./actions/index.js */ \"./actions/index.js\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nconsole.log('rr-main.js loaded');\n\nvar store = (0, _redux.createStore)(_index2.default, { images: {} }, (0, _redux.compose)((0, _redux.applyMiddleware)(_reduxThunk2.default, _rest2.default, (0, _reduxLogger.createLogger)()), _DevTools2.default.instrument()));\n\n// TODO: need store in global scope for now to do testing; remove for production.\n// TODO: need actions in global scope for now as cannot import yet; remove for production.\n\nwindow.mcRrr = {\n    store: store,\n    React: _react2.default,\n    ReactDOM: _reactDom2.default,\n    Provider: _reactRedux.Provider,\n    Frame: _Frame2.default,\n    FlexContainer: _FlexContainer2.default,\n    getImagesByGallerySpecs: _index3.getImagesByGallerySpecs,\n    getImagesBySearchParms: _index3.getImagesBySearchParms\n};\n\n//# sourceURL=webpack:///./rr-main.js?");

/***/ })

/******/ });