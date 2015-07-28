Hoist's Event Pipeline

This is the library responsible for raising events via APIs.

Usually it is used from Hoist-Connect but the aim is that it can be used from any API so it has no reliance on being run in an application.

#Modifying

The source for this library is transpiled using [babel.js](https://babeljs.io/) and modifications should be made in /src not /lib.

Tests run against the transpiled source but that shouldn't matter too much

#Setup
In order to ensure that git hooks are installed (ensures that esdoc and transpilation is run on check-in) make sure you run ```node setup_git_hooks.js``` when you first check out this project.
