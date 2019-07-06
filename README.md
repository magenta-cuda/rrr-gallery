REST React Redux Gallery
==========================

## About

A plug-compatible replacement for the built-in WordPress gallery shortcode implemented with React, Redux and the WordPress REST API v2.
The front-end is made mobile-friendly by using components from Bootstrap and jQuery Mobile.

This was forked from [Backbone Bootstrap Gallery](https://github.com/magenta-cuda/bb-gallery)

This is a hybrid solution. Basically I have divided the state of the application into two domains:

1. The vector of images in the gallery and the view selection
2. The class and style attributes of DOM elements

Changes to the state in domain 1 are handled by React/Redux. Changes to the state in domain 2 are handled directly by JavaScript.
However, I have tried to duplicate the reducer feature of Redux for changes in domain 2 by forcing those changes to pass through
my CSS reducer - CssReducer. This was implemented by monkey patching the addClass(), removeClass(), toggleClass() and css() methods
of jQuery to wrappers in my CssReducer. Thus my CssReducer provides a single point for logging and debugging all changes to the
class and style attributes of DOM elements.

## Demo

A sample working page using this plugin will eventually be found on [my portfolio website](http://magentacuda.com/).

## Requirements

WordPress 5.0

## Installation

Download from [GitHub](https://github.com/magenta-cuda/rrr-gallery/archive/master.zip) and extract to you WordPress plugin folder.
**Currently no working version exists.**
 
## Documentation

The documentation for this plugin can be found [here](http://docs.magentacuda.com/).

