// An advantage of Redux is that all changes to state are handled by the reducer.
// CssReducer handles all className and CSS changes to HTML elements - i.e.
// works like React setState except for class names and CSS attributes. This
// provides a single point for logging and debugging changes to class names and 
// CSS attributes.
//
// JqueryProxy monkey patches jQuery's addClass, removeClass and toggleClass methods
// to call CssReducer's addClass, removeClass and toggleClass methods.

export class JqueryProxy {
    constructor(max = 4, classNameRegEx = null) {
        this.jqueryAddClass          = jQuery.prototype.addClass
        this.jqueryRemoveClass       = jQuery.prototype.removeClass
        this.jqueryToggleClass       = jQuery.prototype.toggleClass
        this.jqueryShow              = jQuery.prototype.show
        this.jqueryHide              = jQuery.prototype.hide
        jQuery.prototype.addClass    = this.addClass
        jQuery.prototype.removeClass = this.removeClass
        jQuery.prototype.toggleClass = this.toggleClass
        jQuery.prototype.show        = this.show
        jQuery.prototype.hide        = this.hide
        this.cssReducer              = new CssReducer(max, classNameRegEx, this)
        JqueryProxy.cssReducer       = this.cssReducer
    }
    addClass(   className) {
        return JqueryProxy.cssReducer.addClass   .call(JqueryProxy.cssReducer, this, className)
    }
    removeClass(className) {
        return JqueryProxy.cssReducer.removeClass.call(JqueryProxy.cssReducer, this, className)
    }
    toggleClass(className) {
        return JqueryProxy.cssReducer.toggleClass.call(JqueryProxy.cssReducer, this, className)
    }
    show() {
        return JqueryProxy.cssReducer.show       .call(JqueryProxy.cssReducer, this)
    }
    hide() {
        return JqueryProxy.cssReducer.hide       .call(JqueryProxy.cssReducer, this)
    }
    getCssReducer() {
        return this.cssReducer
    }
}

export class CssReducer {
    constructor(max = 4, classNameRegEx = null, jqueryProxy = null) {
        CssReducer.max      = max
        this.classNameRegEx = classNameRegEx
        // this.jquery*Class methods must reference the real jQuery.*Class methods
        // The if is is neccessary as I want to support the original interface i.e.,
        // directly calling the cssReducer.*Class methods
        if (jqueryProxy) {
            this.jqueryAddClass          = jqueryProxy.jqueryAddClass
            this.jqueryRemoveClass       = jqueryProxy.jqueryRemoveClass
            this.jqueryToggleClass       = jqueryProxy.jqueryToggleClass
            this.jqueryShow              = jqueryProxy.jqueryShow
            this.jqueryHide              = jqueryProxy.jqueryHide
        } else {
            this.jqueryAddClass          = jQuery.prototype.addClass
            this.jqueryRemoveClass       = jQuery.prototype.removeClass
            this.jqueryToggleClass       = jQuery.prototype.toggleClass
            this.jqueryShow              = jQuery.prototype.show
            this.jqueryHide              = jQuery.prototype.hide
        }
    }
    doClass(method, $elements, className) {
        if (!$elements.length) {
            return $elements
        }
        if (this.classNameRegEx && this.classNameRegEx.test(className)) {
            debugger
        }
        const name = method === this.jqueryAddClass ? 'ADD-CLASS'
                                                    : ( method === this.jqueryRemoveClass ? 'REMOVE-CLASS'
                                                                                          : 'TOGGLE-CLASS' )
        console.log(name + ':before')
        CssReducer.printElements($elements)
        method.call($elements, className)
        console.log(name + ':after')
        CssReducer.printElements($elements)
        // support chaining
        return $elements
    }
    doShowHide(method, $elements) {
        if (!$elements.length) {
            return $elements
        }
        if (this.classNameRegEx && this.classNameRegEx.test($elements.selector)) {
            debugger
        }
        const name = method === this.jqueryShow ? 'SHOW' : 'HIDE'
        console.log(name + ':before')
        CssReducer.printElements($elements)
        method.call($elements)
        console.log(name + ':after')
        CssReducer.printElements($elements)
        // support chaining
        return $elements
    }
    // The $elements argument should be a jQuery object.
    addClass($elements,    className) {
        return this.doClass(this.jqueryAddClass,    $elements, className)
    }
    removeClass($elements, className) {
        return this.doClass(this.jqueryRemoveClass, $elements, className)
    }
    toggleClass($elements, className) {
        return this.doClass(this.jqueryToggleClass, $elements, className)
    }
    show($elements) {
        return this.doShowHide(this.jqueryShow, $elements)
    }
    hide($elements) {
        return this.doShowHide(this.jqueryHide, $elements)
    }
    static printElements($element) {
        $element.each(function(i) {
            if (i === CssReducer.max) {
                console.log('    .....')
                return false
            }
            console.log(`    ${i}: class: "${this.className}", style.display: "${jQuery(this).css('display')}"`)
        })
    }
}
