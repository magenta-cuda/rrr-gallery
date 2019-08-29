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

/***/ "./CssReducer.js":
/*!***********************!*\
  !*** ./CssReducer.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\n// An advantage of Redux is that all changes to state are handled by the reducer.\n// CssReducer handles all className and CSS changes to HTML elements - i.e.\n// works like React setState except for class names and CSS attributes. This\n// provides a single point for logging and debugging changes to class names and \n// CSS attributes.\n//\n// JqueryProxy monkey patches jQuery's addClass, removeClass and toggleClass methods\n// to call CssReducer's addClass, removeClass and toggleClass methods.\n\nvar JqueryProxy = exports.JqueryProxy = function () {\n    function JqueryProxy() {\n        var max = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 4;\n        var classNameRegEx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;\n\n        _classCallCheck(this, JqueryProxy);\n\n        this.jqueryAddClass = jQuery.prototype.addClass;\n        this.jqueryRemoveClass = jQuery.prototype.removeClass;\n        this.jqueryToggleClass = jQuery.prototype.toggleClass;\n        this.jqueryShow = jQuery.prototype.show;\n        this.jqueryHide = jQuery.prototype.hide;\n        this.jqueryCss = jQuery.prototype.css;\n        jQuery.prototype.addClass = this.addClass;\n        jQuery.prototype.removeClass = this.removeClass;\n        jQuery.prototype.toggleClass = this.toggleClass;\n        jQuery.prototype.show = this.show;\n        jQuery.prototype.hide = this.hide;\n        jQuery.prototype.css = this.css;\n        this.cssReducer = new CssReducer(max, classNameRegEx, this);\n        JqueryProxy.cssReducer = this.cssReducer;\n    }\n\n    _createClass(JqueryProxy, [{\n        key: 'addClass',\n        value: function addClass(className) {\n            return JqueryProxy.cssReducer.addClass.call(JqueryProxy.cssReducer, this, className);\n        }\n    }, {\n        key: 'removeClass',\n        value: function removeClass(className) {\n            return JqueryProxy.cssReducer.removeClass.call(JqueryProxy.cssReducer, this, className);\n        }\n    }, {\n        key: 'toggleClass',\n        value: function toggleClass(className) {\n            return JqueryProxy.cssReducer.toggleClass.call(JqueryProxy.cssReducer, this, className);\n        }\n    }, {\n        key: 'show',\n        value: function show() {\n            return JqueryProxy.cssReducer.show.call(JqueryProxy.cssReducer, this);\n        }\n    }, {\n        key: 'hide',\n        value: function hide() {\n            return JqueryProxy.cssReducer.hide.call(JqueryProxy.cssReducer, this);\n        }\n    }, {\n        key: 'css',\n        value: function css() {\n            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {\n                args[_key] = arguments[_key];\n            }\n\n            return JqueryProxy.cssReducer.css.apply(JqueryProxy.cssReducer, [this].concat(args));\n        }\n    }, {\n        key: 'getCssReducer',\n        value: function getCssReducer() {\n            return this.cssReducer;\n        }\n    }]);\n\n    return JqueryProxy;\n}();\n\nvar CssReducer = exports.CssReducer = function () {\n    function CssReducer() {\n        var max = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 4;\n        var classNameRegEx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;\n        var jqueryProxy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;\n\n        _classCallCheck(this, CssReducer);\n\n        CssReducer.max = max;\n        this.classNameRegEx = classNameRegEx;\n        // this.jquery*Class methods must reference the real jQuery.*Class methods\n        // The if is is neccessary as I want to support the original interface i.e.,\n        // directly calling the cssReducer.*Class methods\n        if (jqueryProxy) {\n            this.jqueryAddClass = jqueryProxy.jqueryAddClass;\n            this.jqueryRemoveClass = jqueryProxy.jqueryRemoveClass;\n            this.jqueryToggleClass = jqueryProxy.jqueryToggleClass;\n            this.jqueryShow = jqueryProxy.jqueryShow;\n            this.jqueryHide = jqueryProxy.jqueryHide;\n            this.jqueryCss = jqueryProxy.jqueryCss;\n        } else {\n            this.jqueryAddClass = jQuery.prototype.addClass;\n            this.jqueryRemoveClass = jQuery.prototype.removeClass;\n            this.jqueryToggleClass = jQuery.prototype.toggleClass;\n            this.jqueryShow = jQuery.prototype.show;\n            this.jqueryHide = jQuery.prototype.hide;\n            this.jqueryCss = jQuery.prototype.css;\n        }\n    }\n\n    _createClass(CssReducer, [{\n        key: 'doClass',\n        value: function doClass(method, $elements, className) {\n            if (!$elements.length) {\n                return $elements;\n            }\n            if (this.classNameRegEx && this.classNameRegEx.test(className)) {\n                debugger;\n            }\n            var name = method === this.jqueryAddClass ? 'ADD-CLASS' : method === this.jqueryRemoveClass ? 'REMOVE-CLASS' : 'TOGGLE-CLASS';\n            console.log(name + ':before');\n            CssReducer.printElements($elements);\n            method.call($elements, className);\n            console.log(name + ':after');\n            CssReducer.printElements($elements);\n            // support chaining\n            return $elements;\n        }\n    }, {\n        key: 'doShowHide',\n        value: function doShowHide(method, $elements) {\n            if (!$elements.length) {\n                return $elements;\n            }\n            if (this.classNameRegEx && this.classNameRegEx.test($elements.selector)) {\n                debugger;\n            }\n            var name = method === this.jqueryShow ? 'SHOW' : 'HIDE';\n            console.log(name + ':before');\n            CssReducer.printElements($elements);\n            method.call($elements);\n            console.log(name + ':after');\n            CssReducer.printElements($elements);\n            // support chaining\n            return $elements;\n        }\n        // The $elements argument should be a jQuery object.\n\n    }, {\n        key: 'addClass',\n        value: function addClass($elements, className) {\n            return this.doClass(this.jqueryAddClass, $elements, className);\n        }\n    }, {\n        key: 'removeClass',\n        value: function removeClass($elements, className) {\n            return this.doClass(this.jqueryRemoveClass, $elements, className);\n        }\n    }, {\n        key: 'toggleClass',\n        value: function toggleClass($elements, className) {\n            return this.doClass(this.jqueryToggleClass, $elements, className);\n        }\n    }, {\n        key: 'show',\n        value: function show($elements) {\n            return this.doShowHide(this.jqueryShow, $elements);\n        }\n    }, {\n        key: 'hide',\n        value: function hide($elements) {\n            return this.doShowHide(this.jqueryHide, $elements);\n        }\n    }, {\n        key: 'css',\n        value: function css($elements) {\n            if (!$elements.length) {\n                return $elements;\n            }\n            if (this.classNameRegEx && this.classNameRegEx.test($elements.selector)) {\n                debugger;\n            }\n\n            for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {\n                args[_key2 - 1] = arguments[_key2];\n            }\n\n            if (args.length === 1 && _typeof(args[0]) === 'object' || args.length === 2 && typeof args[0] === 'string') {\n                CssReducer.printElements($elements, args);\n            }\n            return this.jqueryCss.apply($elements, args);\n        }\n    }], [{\n        key: 'printElements',\n        value: function printElements($element, css) {\n            $element.each(function (i) {\n                if (i === CssReducer.max) {\n                    console.log('    .....');\n                    return false;\n                }\n                console.log('    ' + i + ': class: \"' + this.className + '\", style.display: \"' + jQuery(this).css('display') + '\"');\n                if (css) {\n                    console.log('        css: ', css);\n                }\n            });\n        }\n    }]);\n\n    return CssReducer;\n}();\n\n//# sourceURL=webpack:///./CssReducer.js?");

/***/ }),

/***/ "./actions/index.js":
/*!**************************!*\
  !*** ./actions/index.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\nexports.setConfiguration = exports.SET_CONFIGURATION = exports.setStatus = exports.STATUS_LOADED = exports.STATUS_LOADING = exports.SET_STATUS = exports.setView = exports.SET_VIEW = exports.handleLoadFailed = exports.HANDLE_LOAD_FAILED = exports.loadSearchImages = exports.LOAD_SEARCH_IMAGES = exports.loadGalleryImages = exports.LOAD_GALLERY_IMAGES = exports.getImagesBySearchParms = exports.getImagesByGallerySpecs = undefined;\n\nvar _rest = __webpack_require__(/*! ../middleware/rest.js */ \"./middleware/rest.js\");\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nvar getImagesByGallerySpecs = exports.getImagesByGallerySpecs = function getImagesByGallerySpecs(id, specs) {\n    return _defineProperty({}, _rest.REST, {\n        id: id,\n        specs: specs\n    });\n};\n\nvar getImagesBySearchParms = exports.getImagesBySearchParms = function getImagesBySearchParms(id, parms) {\n    return _defineProperty({}, _rest.REST, {\n        id: id,\n        parms: parms\n    });\n};\n\nvar LOAD_GALLERY_IMAGES = exports.LOAD_GALLERY_IMAGES = 'LOAD-GALLERY-IMAGES';\n\nvar loadGalleryImages = exports.loadGalleryImages = function loadGalleryImages(id, images) {\n    return {\n        type: LOAD_GALLERY_IMAGES,\n        id: id,\n        images: images\n    };\n};\n\nvar LOAD_SEARCH_IMAGES = exports.LOAD_SEARCH_IMAGES = 'LOAD-SEARCH-IMAGES';\n\nvar loadSearchImages = exports.loadSearchImages = function loadSearchImages(id, images, parms) {\n    return {\n        type: LOAD_SEARCH_IMAGES,\n        id: id,\n        images: images,\n        parms: parms\n    };\n};\n\nvar HANDLE_LOAD_FAILED = exports.HANDLE_LOAD_FAILED = 'HANDLE-LOAD-FAILED';\n\nvar handleLoadFailed = exports.handleLoadFailed = function handleLoadFailed(id, images) {\n    return {\n        type: HANDLE_LOAD_FAILED,\n        id: id,\n        images: images\n    };\n};\n\nvar SET_VIEW = exports.SET_VIEW = 'SET-VIEW';\n\nvar setView = exports.setView = function setView(id, view) {\n    return {\n        type: SET_VIEW,\n        id: id,\n        view: view\n    };\n};\n\nvar SET_STATUS = exports.SET_STATUS = 'SET-STATUS';\nvar STATUS_LOADING = exports.STATUS_LOADING = 'loading';\nvar STATUS_LOADED = exports.STATUS_LOADED = 'loaded';\n\nvar setStatus = exports.setStatus = function setStatus(id, status) {\n    return {\n        type: SET_STATUS,\n        id: id,\n        status: status\n    };\n};\n\nvar SET_CONFIGURATION = exports.SET_CONFIGURATION = 'SET-CONFIGURATION';\n\nvar setConfiguration = exports.setConfiguration = function setConfiguration(configuration) {\n    return {\n        type: SET_CONFIGURATION,\n        configuration: configuration\n    };\n};\n\n//# sourceURL=webpack:///./actions/index.js?");

/***/ }),

/***/ "./components/FlexContainer.js":
/*!*************************************!*\
  !*** ./components/FlexContainer.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _react = __webpack_require__(/*! react */ \"../node_modules/react/index.js\");\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _FlexItem = __webpack_require__(/*! ../components/FlexItem.js */ \"./components/FlexItem.js\");\n\nvar _FlexItem2 = _interopRequireDefault(_FlexItem);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Flex Container\n\nvar FlexContainer = function (_React$Component) {\n    _inherits(FlexContainer, _React$Component);\n\n    function FlexContainer(props) {\n        _classCallCheck(this, FlexContainer);\n\n        var _this = _possibleConstructorReturn(this, (FlexContainer.__proto__ || Object.getPrototypeOf(FlexContainer)).call(this, props));\n\n        _this.container = null;\n        return _this;\n    }\n\n    _createClass(FlexContainer, [{\n        key: 'render',\n        value: function render() {\n            var _this2 = this;\n\n            console.log('FlexContainer.render():this.props=', this.props);\n            var collection = this.props.images;\n            var minWidth = this.props.configuration.bbg_xiv_flex_min_width;\n            if (typeof collection === 'string') {\n                return _react2.default.createElement(\n                    'h1',\n                    null,\n                    collection\n                );\n            }\n            var jsx = [];\n            collection.forEach(function (model) {\n                jsx.push(_react2.default.createElement(_FlexItem2.default, { data: model.attributes, key: model.attributes.id, minWidth: minWidth }));\n            });\n            console.log('FlexContainer():jsx=', jsx);\n            return _react2.default.createElement(\n                'div',\n                { className: 'bbg_xiv-container bbg_xiv-flex_container bbg_xiv-tiles_container mc-rrr-jsx-container',\n                    'data-bbg_xiv-gallery-id': collection.id, ref: function ref(node) {\n                        _this2.container = node;\n                    } },\n                jsx,\n                _react2.default.createElement('div', { className: 'bbg_xiv-flex_footer' }),\n                _react2.default.createElement('div', { className: 'mc-rrr-react-overlay-root' })\n            );\n        }\n    }, {\n        key: 'componentDidMount',\n        value: function componentDidMount() {\n            window.bbg_xiv.postRenderFlexContainer(this.container);\n        }\n    }, {\n        key: 'componentDidUpdate',\n        value: function componentDidUpdate(prevProps, prevState, snapshot) {\n            window.setTimeout(function () {\n                jQuery(window).resize();\n            }, 100);\n        }\n    }]);\n\n    return FlexContainer;\n}(_react2.default.Component);\n\nexports.default = FlexContainer;\n\n//# sourceURL=webpack:///./components/FlexContainer.js?");

/***/ }),

/***/ "./components/FlexItem.js":
/*!********************************!*\
  !*** ./components/FlexItem.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _react = __webpack_require__(/*! react */ \"../node_modules/react/index.js\");\n\nvar _react2 = _interopRequireDefault(_react);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Flex Item Template\n\nvar FlexItem = function (_React$Component) {\n    _inherits(FlexItem, _React$Component);\n\n    function FlexItem(props) {\n        _classCallCheck(this, FlexItem);\n\n        var _this = _possibleConstructorReturn(this, (FlexItem.__proto__ || Object.getPrototypeOf(FlexItem)).call(this, props));\n\n        _this.handleImageClick = function (e) {\n            e.preventDefault();\n            // TODO: this.img may not be necessary as it probably is only used to get this.props.data\n            window.bbg_xiv.showOverlay(e, false, this.img, this.props.data);\n        };\n\n        _this.handleInfoMouseEnter = function (e) {\n            e.preventDefault();\n            // TODO: this.img may not be necessary as it probably is only used to get this.props.data\n            window.bbg_xiv.showOverlay(e, true, this.img, this.props.data);\n        };\n\n        _this.img = null;\n        _this.handleImageClick = _this.handleImageClick.bind(_this);\n        _this.handleInfoMouseEnter = _this.handleInfoMouseEnter.bind(_this);\n        return _this;\n    }\n\n    _createClass(FlexItem, [{\n        key: 'render',\n        value: function render() {\n            var _this2 = this;\n\n            var data = this.props.data;\n            var minWidth = this.props.minWidth;\n            var className = '';\n            var dataGalleryIndex = '';\n            if (typeof data.gallery_index !== 'undefined') {\n                className = 'bbg_xiv-gallery_icon';\n                dataGalleryIndex = data.gallery_index;\n            }\n            return _react2.default.createElement(\n                'div',\n                { className: 'bbg_xiv-flex_item' },\n                _react2.default.createElement(\n                    'figure',\n                    null,\n                    _react2.default.createElement(\n                        'figcaption',\n                        null,\n                        bbg_xiv.getTitle(data)\n                    ),\n                    _react2.default.createElement(\n                        'a',\n                        { href: data.link, target: '_blank', className: className, 'data-gallery-index': dataGalleryIndex },\n                        _react2.default.createElement('img', { src: bbg_xiv.getSrc(data, 'viewport', true), srcSet: bbg_xiv.getSrcset(data),\n                            sizes: bbg_xiv.getSizes(data, 'viewport', true),\n                            alt: bbg_xiv.getAlt(data), title: bbg_xiv.getTitle(data), 'data-bbg_xiv-image-id': data.id,\n                            'data-min-width': minWidth, ref: function ref(node) {\n                                _this2.img = node;\n                            } })\n                    )\n                ),\n                _react2.default.createElement(\n                    'a',\n                    { href: data.link, target: '_blank', className: className, 'data-gallery-index': dataGalleryIndex },\n                    _react2.default.createElement(\n                        'div',\n                        { className: 'bbg_xiv-dense_full_btn', title: bbg_xiv.getCaption(data) },\n                        _react2.default.createElement(\n                            'button',\n                            { className: 'bbg_xiv-dense_alt_btn bbg_xiv-flex_from_image btn' },\n                            _react2.default.createElement('span', { className: 'glyphicon glyphicon-info-sign', onMouseOver: this.handleInfoMouseEnter })\n                        ),\n                        _react2.default.createElement(\n                            'button',\n                            { className: 'bbg_xiv-dense_full_btn bbg_xiv-flex_from_image btn', onClick: this.handleImageClick },\n                            _react2.default.createElement('span', { className: 'glyphicon glyphicon-fullscreen' })\n                        )\n                    )\n                )\n            );\n        }\n    }, {\n        key: 'componentDidCatch',\n        value: function componentDidCatch(error, info) {\n            console.log('FlexItem:', error, info);\n        }\n    }], [{\n        key: 'getDerivedStateFromError',\n        value: function getDerivedStateFromError(error) {\n            console.log('FlexItem:', error);\n            return {};\n        }\n    }]);\n\n    return FlexItem;\n}(_react2.default.Component);\n\nexports.default = FlexItem;\n\n//# sourceURL=webpack:///./components/FlexItem.js?");

/***/ }),

/***/ "./components/Frame.js":
/*!*****************************!*\
  !*** ./components/Frame.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _react = __webpack_require__(/*! react */ \"../node_modules/react/index.js\");\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _Gallery = __webpack_require__(/*! ../containers/Gallery.js */ \"./containers/Gallery.js\");\n\nvar _Gallery2 = _interopRequireDefault(_Gallery);\n\nvar _DevTools = __webpack_require__(/*! ../containers/DevTools.js */ \"./containers/DevTools.js\");\n\nvar _DevTools2 = _interopRequireDefault(_DevTools);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nexports.default = function (props) {\n    return _react2.default.createElement(\n        'div',\n        { id: 'mc-rrr-jsx-frame', className: 'mc-rrr-jsx-frame' },\n        _react2.default.createElement(_Gallery2.default, { id: \"gallery-\" + props.id }),\n        _react2.default.createElement(_DevTools2.default, null)\n    );\n};\n\n//# sourceURL=webpack:///./components/Frame.js?");

/***/ }),

/***/ "./components/Gallery.js":
/*!*******************************!*\
  !*** ./components/Gallery.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _react = __webpack_require__(/*! react */ \"../node_modules/react/index.js\");\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _index = __webpack_require__(/*! ../actions/index.js */ \"./actions/index.js\");\n\nvar _FlexContainer = __webpack_require__(/*! ../components/FlexContainer.js */ \"./components/FlexContainer.js\");\n\nvar _FlexContainer2 = _interopRequireDefault(_FlexContainer);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\nvar Gallery = function (_React$Component) {\n    _inherits(Gallery, _React$Component);\n\n    function Gallery(props) {\n        _classCallCheck(this, Gallery);\n\n        var _this = _possibleConstructorReturn(this, (Gallery.__proto__ || Object.getPrototypeOf(Gallery)).call(this, props));\n\n        wp.api.loadPromise.done(function () {\n            var images = new wp.api.collections.Media();\n            images.reset(JSON.parse(bbg_xiv[props.id + \"-data\"]));\n            props.loadGalleryImages(props.id, images);\n        });\n        return _this;\n    }\n\n    _createClass(Gallery, [{\n        key: 'render',\n        value: function render() {\n            var _props = this.props,\n                images = _props.images,\n                configuration = _props.configuration,\n                setView = _props.setView;\n\n            if (!images || images.status === _index.STATUS_LOADING) {\n                return _react2.default.createElement(\n                    'div',\n                    { className: 'ui-loader' },\n                    _react2.default.createElement('span', { className: 'ui-icon-loading' })\n                );\n            }\n            var Container = _FlexContainer2.default;\n            console.log('Gallery:images=', images);\n            switch (images.view) {\n                case 'Gallery':\n                    Container = _FlexContainer2.default;\n                    break;\n                case 'Carousel':\n                    Container = CarouselContainer;\n                    break;\n                case 'Justified':\n                    Container = JustifiedGalleryContainer;\n                    break;\n                case 'Tabs':\n                    Container = TabsContainer;\n                    break;\n                case 'Dense':\n                    Container = DenseContainer;\n                    break;\n            }\n            return _react2.default.createElement(Container, { images: images, configuration: configuration, setView: setView });\n        }\n    }, {\n        key: 'componentDidCatch',\n        value: function componentDidCatch(error, info) {\n            console.log('Gallery:', error, info);\n        }\n    }], [{\n        key: 'getDerivedStateFromError',\n        value: function getDerivedStateFromError(error) {\n            console.log('Gallery:', error);\n            return {};\n        }\n    }]);\n\n    return Gallery;\n}(_react2.default.Component);\n\nexports.default = Gallery;\n\n//# sourceURL=webpack:///./components/Gallery.js?");

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
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _reactRedux = __webpack_require__(/*! react-redux */ \"../node_modules/react-redux/es/index.js\");\n\nvar _Gallery = __webpack_require__(/*! ../components/Gallery.js */ \"./components/Gallery.js\");\n\nvar _Gallery2 = _interopRequireDefault(_Gallery);\n\nvar _index = __webpack_require__(/*! ../actions/index.js */ \"./actions/index.js\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar mapStateToProps = function mapStateToProps(state, ownProps) {\n    return {\n        id: ownProps.id,\n        images: state.galleries.images && state.galleries.images[ownProps.id] ? state.galleries.images[ownProps.id] : null,\n        configuration: state.configuration\n    };\n};\n\nvar mapDispatchToProps = function mapDispatchToProps(dispatch) {\n    return {\n        setView: function setView(id, view) {\n            return dispatch((0, _index.setView)(id, view));\n        },\n        loadGalleryImages: function loadGalleryImages(id, images) {\n            return dispatch((0, _index.loadGalleryImages)(id, images));\n        }\n    };\n};\n\nexports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_Gallery2.default);\n\n//# sourceURL=webpack:///./containers/Gallery.js?");

/***/ }),

/***/ "./middleware/rest.js":
/*!****************************!*\
  !*** ./middleware/rest.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\nexports.REST = undefined;\n\nvar _index = __webpack_require__(/*! ../actions/index.js */ \"./actions/index.js\");\n\nvar REST = exports.REST = 'REST';\n\nexports.default = function (store) {\n    return function (next) {\n        return function (action) {\n            var rest = action[REST];\n            if (typeof rest === 'undefined') {\n                return next(action);\n            }\n            console.log('rest.js:action=', action);\n            // debugger\n            next((0, _index.setStatus)(rest.id, _index.STATUS_LOADING));\n            if (typeof rest.specs !== 'undefined') {\n                var id = rest.id,\n                    specs = rest.specs;\n\n                var images = new wp.api.collections.Media();\n                images.once(\"sync\", function () {\n                    // the sync event will occur once only on the Backbone fetch of the collection\n                    next((0, _index.loadGalleryImages)(id, images));\n                    next((0, _index.setStatus)(id, _index.STATUS_LOADED));\n                });\n                images.fetch({\n                    data: specs,\n                    success: function success(c, r, o) {},\n                    error: function error(c, r) {\n                        next((0, _index.handleLoadFailed)(id, images, specs));\n                    }\n                });\n            } else if (typeof rest.parms !== 'undefined') {\n                var _id = rest.id;\n                var parms = rest.parms;\n                var _images = new wp.api.collections.Media();\n                _images.once(\"sync\", function () {\n                    // the sync event will occur once only on the Backbone fetch of the collection\n                    next((0, _index.loadSearchImages)(_id, _images, parms));\n                    next((0, _index.setStatus)(_id, _index.STATUS_LOADED));\n                });\n                // get the next part of the multi-part search result as specified by page\n                _images.fetch({\n                    data: {\n                        search: parms.query,\n                        page: parms.page,\n                        per_page: parms.searchLimit\n                    },\n                    success: function success(c, r, o) {},\n                    error: function error(c, r) {\n                        next((0, _index.handleLoadFailed)(_id, _images, parms));\n                    }\n                });\n            }\n        };\n    };\n};\n\n//# sourceURL=webpack:///./middleware/rest.js?");

/***/ }),

/***/ "./reducers/index.js":
/*!***************************!*\
  !*** ./reducers/index.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };\n\nvar _index = __webpack_require__(/*! ../actions/index.js */ \"./actions/index.js\");\n\nvar _redux = __webpack_require__(/*! redux */ \"../node_modules/redux/es/redux.js\");\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nvar galleries = function galleries() {\n    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};\n    var action = arguments[1];\n\n    switch (action.type) {\n        case _index.LOAD_GALLERY_IMAGES:\n        case _index.LOAD_SEARCH_IMAGES:\n            {\n                action.images.id = action.id;\n                var images = _extends({}, state.images, _defineProperty({}, action.id, action.images));\n                if (action.type === _index.LOAD_GALLERY_IMAGES) {\n                    console.log('reducers:LOAD_GALLERY_IMAGES:action=', action);\n                    return _extends({}, state, { images: images });\n                }\n                console.log('reducers:LOAD_SEARCH_IMAGES:action=', action);\n                // TODO: search also has multi page state\n                images[action.id].query = action.parms.query;\n                console.log('reducers:LOAD_SEARCH_IMAGES:images=', images);\n                return _extends({}, state, { images: images });\n            }\n        case _index.HANDLE_LOAD_FAILED:\n            return state;\n        case _index.SET_VIEW:\n            {\n                var _images = _extends({}, state.images);\n                // Cannot clone images using the spread operator since it is also necessary to preserve the prototype chain.\n                _images[action.id] = Object.assign(new wp.api.collections.Media(), _images[action.id]);\n                _images[action.id].view = action.view;\n                return _extends({}, state, { images: _images });\n            }\n        case _index.SET_STATUS:\n            {\n                var _images2 = _extends({}, state.images);\n                // Cannot clone images using the spread operator since it is also necessary to preserve the prototype chain.\n                _images2[action.id] = Object.assign(new wp.api.collections.Media(), _images2[action.id]);\n                _images2[action.id].status = action.status;\n                return _extends({}, state, { images: _images2 });\n            }\n        default:\n            return state;\n    }\n};\n\nvar configuration = function configuration() {\n    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};\n    var action = arguments[1];\n\n    switch (action.type) {\n        case _index.SET_CONFIGURATION:\n            {\n                return action.configuration;\n            }\n        default:\n            return state;\n    }\n};\n\nvar rootReducer = (0, _redux.combineReducers)({\n    galleries: galleries,\n    configuration: configuration\n});\n\nexports.default = rootReducer;\n\n//# sourceURL=webpack:///./reducers/index.js?");

/***/ }),

/***/ "./rr-main.js":
/*!********************!*\
  !*** ./rr-main.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _react = __webpack_require__(/*! react */ \"../node_modules/react/index.js\");\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _reactDom = __webpack_require__(/*! react-dom */ \"../node_modules/react-dom/index.js\");\n\nvar _reactDom2 = _interopRequireDefault(_reactDom);\n\nvar _redux = __webpack_require__(/*! redux */ \"../node_modules/redux/es/redux.js\");\n\nvar _reactRedux = __webpack_require__(/*! react-redux */ \"../node_modules/react-redux/es/index.js\");\n\nvar _reduxThunk = __webpack_require__(/*! redux-thunk */ \"../node_modules/redux-thunk/es/index.js\");\n\nvar _reduxThunk2 = _interopRequireDefault(_reduxThunk);\n\nvar _reduxLogger = __webpack_require__(/*! redux-logger */ \"../node_modules/redux-logger/dist/redux-logger.js\");\n\nvar _index = __webpack_require__(/*! ./reducers/index.js */ \"./reducers/index.js\");\n\nvar _index2 = _interopRequireDefault(_index);\n\nvar _rest = __webpack_require__(/*! ./middleware/rest.js */ \"./middleware/rest.js\");\n\nvar _rest2 = _interopRequireDefault(_rest);\n\nvar _Frame = __webpack_require__(/*! ./components/Frame.js */ \"./components/Frame.js\");\n\nvar _Frame2 = _interopRequireDefault(_Frame);\n\nvar _DevTools = __webpack_require__(/*! ./containers/DevTools.js */ \"./containers/DevTools.js\");\n\nvar _DevTools2 = _interopRequireDefault(_DevTools);\n\nvar _index3 = __webpack_require__(/*! ./actions/index.js */ \"./actions/index.js\");\n\nvar _CssReducer = __webpack_require__(/*! ./CssReducer.js */ \"./CssReducer.js\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nconsole.log('rr-main.js loading...');\n//import NavBar from './containers/NavBar.js'\n\n\nvar store = (0, _redux.createStore)(_index2.default, { galleries: { images: {} }, configuration: {} }, (0, _redux.compose)((0, _redux.applyMiddleware)(_reduxThunk2.default, _rest2.default, (0, _reduxLogger.createLogger)()), _DevTools2.default.instrument()));\n\n// TODO: need store in global scope for now to do testing; remove for production.\n// TODO: need actions in global scope for now as cannot import yet; remove for production.\n\nwindow.mcRrr = {\n    store: store,\n    React: _react2.default,\n    useState: _react.useState,\n    useEffect: _react.useEffect,\n    ReactDOM: _reactDom2.default,\n    connect: _reactRedux.connect,\n    Provider: _reactRedux.Provider,\n    Frame: _Frame2.default,\n    //    NavBar:                  NavBar,\n    setView: _index3.setView,\n    loadGalleryImages: _index3.loadGalleryImages,\n    getImagesByGallerySpecs: _index3.getImagesByGallerySpecs,\n    getImagesBySearchParms: _index3.getImagesBySearchParms,\n    setConfiguration: _index3.setConfiguration,\n    CssReducer: new _CssReducer.JqueryProxy().getCssReducer()\n};\n\nconsole.log('rr-main.js loaded.');\n\n//# sourceURL=webpack:///./rr-main.js?");

/***/ })

/******/ });