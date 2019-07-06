// An advantage of Redux is that all changes to state are handled by the reducer.
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
        this.cssReducer              = new CssReducer(max, classNameRegEx, this)
        JqueryProxy.cssReducer       = this.cssReducer
    }
    addClass(className) {
        return JqueryProxy.cssReducer.addClass.call(JqueryProxy.cssReducer, this, className)
    }
    removeClass(className) {
        return JqueryProxy.cssReducer.removeClass.call(JqueryProxy.cssReducer, this, className)
    }
    toggleClass(className) {
        return JqueryProxy.cssReducer.toggleClass.call(JqueryProxy.cssReducer, this, className)
    }
    getCssReducer() {
        return this.cssReducer
    }
}

export class CssReducer {
    constructor(max = 4, classNameRegEx = null, jqueryProxy = null) {
        this.max                     = max
        this.classNameRegEx          = classNameRegEx
        // this.jquery*Class methods must reference the real jQuery.*Class methods
        // The if is is neccessary as I want to support the original interface i.e.,
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
    doClass(method, name, $elements, className) {
        if (this.classNameRegEx && this.classNameRegEx.test(className)) {
            debugger
        }
        console.log(name + ':before')
        CssReducer.printElements($elements)
        method.call($elements, className)
        console.log(name + ':after')
        CssReducer.printElements($elements)
        // support chaining
        return $elements
    }
    addClass($elements, className) {
        return this.doClass(this.jqueryAddClass, 'ADD-CLASS', $elements, className)
    }
    removeClass($elements, className) {
        return this.doClass(this.jqueryRemoveClass, 'REMOVE-CLASS', $elements, className)
    }
    toggleClass($elements, className) {
        return this.doClass(this.jqueryToggleClass, 'TOGGLE-CLASS', $elements, className)
    }
    static printElements($element) {
        $element.each(function(i) {
            if (i === this.max) {
                console.log('    .....')
                return false
            }
            console.log(`    ${i}: "${this.className}"`)
        })
    }
}
