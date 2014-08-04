# pow-core [![Build Status](https://travis-ci.org/justindujardin/pow-core.svg?branch=master)](https://travis-ci.org/justindujardin/pow-core) [![Coverage Status](https://img.shields.io/coveralls/justindujardin/pow-core.svg)](https://coveralls.io/r/justindujardin/pow-core?branch=master)

Core Typescript classes for use in the various Pow related projects.  Currently depends on JQuery for resource loading classes, and Underscore.js for general awesome.

## Using

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

Install the npm dependencies:

> npm install

Run the developer workflow:

> grunt develop

## Contributing

Commit messages should [follow conventions](https://github.com/justindujardin/pow-core/blob/master/CONVENTIONS.md), and pull requests must *not* include checked in versions of the files in `lib/`.  The lib directory checkins happen automatically during tag releases.

