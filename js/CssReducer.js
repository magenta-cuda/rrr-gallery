// An advantage of React is that all changes to state are handled by the reducer.
// CssReducer handles all className and CSS changes to HTML elements - i.e.
// works like React setState except for class names and CSS attributes. This
// provides a single point for logging and debugging changes to class names and 
// CSS attributes.
//
// The $elements argument should be a jQuery object.
//
// JqueryProxy monkey patches jQuery's addClass, removeClass and toggleClass methods
// to call CssReducer's addClass, removeClass and toggleClass methods.

export class JqueryProxy {
    constructor(max = 4, classNameRegEx = null) {
        this.jqueryAddClass          = jQuery.prototype.addClass
        this.jqueryRemoveClass       = jQuery.prototype.removeClass
        this.jqueryToggleClass       = jQuery.prototype.toggleClass
        jQuery.prototype.addClass    = this.addClass
        jQuery.prototype.removeClass = this.removeClass
        jQuery.prototype.toggleClass = this.toggleClass
        this.cssReducer = new CssReducer(max, classNameRegEx, this)
    }
    addClass(className) {
        // TODO: window.mcRrr.CssReducer is ugly 
        return window.mcRrr.CssReducer.addClass.call(window.mcRrr.CssReducer, this, className)
    }
    removeClass(className) {
        return window.mcRrr.CssReducer.removeClass.call(window.mcRrr.CssReducer, this, className)
    }
    toggleClass(className) {
        return window.mcRrr.CssReducer.toggleClass.call(window.mcRrr.CssReducer, this, className)
    }
    getCssReducer() {
        return this.cssReducer;
    }
}

export class CssReducer {
    constructor(max = 4, classNameRegEx = null, jqueryProxy = null) {
        this.max                     = max
        this.classNameRegEx          = classNameRegEx
        // this.jquery*Class methods must reference the real jQuery.*Class methods
        // This is neccessary as I want to support the original interface i.e.,
        // directly calling the cssReducer.*Class methods
        if (jqueryProxy) {
            this.jqueryAddClass          = jqueryProxy.jqueryAddClass
            this.jqueryRemoveClass       = jqueryProxy.jqueryRemoveClass
            this.jqueryToggleClass       = jqueryProxy.jqueryToggleClass
        } else {
            this.jqueryAddClass          = jQuery.prototype.addClass
            this.jqueryRemoveClass       = jQuery.prototype.removeClass
            this.jqueryToggleClass       = jQuery.prototype.toggleClass
        }
    }
    addClass($elements, className) {
        if (this.classNameRegEx && this.classNameRegEx.test(className)) {
            debugger
        }
        console.log('ADD-CLASS:before')
        CssReducer.printElements($elements)
        this.jqueryAddClass.call($elements, className)
        console.log('ADD-CLASS:after')
        CssReducer.printElements($elements)
        // support chaining
        return $elements
    }
    removeClass($elements, className) {
        if (this.classNameRegEx && this.classNameRegEx.test(className)) {
            debugger
        }
        console.log('REMOVE-CLASS:before')
        CssReducer.printElements($elements)
        this.jqueryRemoveClass.call($elements, className)
        console.log('REMOVE-CLASS:after')
        CssReducer.printElements($elements)
        // support chaining
        return $elements
    }
    toggleClass($elements, className) {
        if (this.classNameRegEx && this.classNameRegEx.test(className)) {
            debugger
        }
        console.log('TOGGLE-CLASS:before')
        CssReducer.printElements($elements)
        this.jqueryToggleClass.call($elements, className)
        console.log('TOGGLE-CLASS:after')
        CssReducer.printElements($elements)
        // support chaining
        return $elements
    }
    static printElements($element) {
        $element.each(function(i) {
            if (i === this.max) {
                return false
            }
            console.log(`    ${i}: "${this.className}"`)
        })
    }
}
