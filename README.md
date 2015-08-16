# pow-core [![Build Status](https://travis-ci.org/justindujardin/pow-core.svg?branch=master)](https://travis-ci.org/justindujardin/pow-core) [![Coverage Status](https://img.shields.io/coveralls/justindujardin/pow-core.svg)](https://coveralls.io/r/justindujardin/pow-core?branch=master) [![Join the chat at https://gitter.im/justindujardin/pow-core](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/justindujardin/pow-core?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Core Typescript classes for use in the various Pow related projects.  Uses JQuery for resource loading, and Underscore.js for general awesome.

## Features
 
- Serialized Entity composition with hot-swappable Component objects.
- Resource Manager for loading Audio, Image, JSON, Javascript, XML, Tiled TMX, and Tiled TSX files.
- Events class based on Backbone.Events.
- Point and Rect classes for representing spatial objects.
- Time manager that can efficiently notify many objects of time and frame updates.
- World class for grouing app specific data so that there may be many distinct apps on a given page.


## Installation

`bower install --save pow-core`

## Building

[Download](http://nodejs.org/) and install Node.JS if you don't have it:

> node --version
>
> npm --version

Install the `grunt` utility:

> npm install -g grunt-cli
>
> grunt --version

Install the `bower` utility that's used for installing javascript libraries:

> npm install -g bower

Install the npm and bower dependencies:

> npm install && bower install

Run the developer workflow:

> grunt develop

## Contributing

Commit messages should [follow conventions](https://github.com/justindujardin/pow-core/blob/master/CONVENTIONS.md).

