// An advantage of React is that all changes to state are handled by the reducer.
// CssReducer handles all className and CSS changes to HTML elements - i.e.
// works like React setState except for class names and CSS attributes. This
// provides a single point for logging and debugging changes to class names and 
// CSS attributes.
//
// The $elements argument should be a jQuery object.

export default class CssReducer {
    constructor(max = 4) {
        this.max = max
    }
    addClass($elements, className) {
        console.log('ADDCLASS:before')
        this.printElements($elements)
        $elements.addClass(className)
        console.log('ADDCLASS:after')
         this.printElements($elements)
    }
    removeClass($elements, className) {
        console.log('REMOVECLASS:before')
        this.printElements($elements)
        $elements.removeClass(className)
        console.log('REMOVECLASS:after')
        this.printElements($elements)
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
