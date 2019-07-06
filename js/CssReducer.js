// An advantage of React is that all changes to state are handled by the reducer.
// CssReducer handles all className and CSS changes to HTML elements - i.e.
// works like React setState except for class names and CSS attributes. This
// provides a single point for logging and debugging changes to class names and 
// CSS attributes.
//
// The $elements argument should be a jQuery object.
//
// TODO: This is not the best way - better to monkey patch jQuery's addClass,
// removeClass, toogleClass methods.

export default class CssReducer {
    constructor(max = 4, classNameRegEx = null) {
        this.max            = max
        this.classNameRegEx = classNameRegEx
    }
    addClass($elements, className) {
        if (this.classNameRegEx && this.classNameRegEx.test(className)) {
            debugger
        }
        console.log('ADD-CLASS:before')
        this.printElements($elements)
        $elements.addClass(className)
        console.log('ADD-CLASS:after')
        this.printElements($elements)
        // support chaining
        return $elements
    }
    removeClass($elements, className) {
        if (this.classNameRegEx && this.classNameRegEx.test(className)) {
            debugger
        }
        console.log('REMOVE-CLASS:before')
        this.printElements($elements)
        $elements.removeClass(className)
        console.log('REMOVE-CLASS:after')
        this.printElements($elements)
        // support chaining
        return $elements
    }
    toggleClass($elements, className) {
        if (this.classNameRegEx && this.classNameRegEx.test(className)) {
            debugger
        }
        console.log('TOGGLE-CLASS:before')
        this.printElements($elements)
        $elements.toggleClass(className)
        console.log('TOGGLE-CLASS:after')
        this.printElements($elements)
        // support chaining
        return $elements
    }
    printElements($element) {
        $element.each(function(i) {
            if (i === this.max) {
                return false
            }
            console.log(`    ${i}: "${this.className}"`)
        })
    }
}
