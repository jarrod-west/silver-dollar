# Review Instructions

Developed in typescript, transpiled and packaged with webpack.

Designed for a POSIX-terminal, but could work on other machines with the
appropriate pre-requisites (see below)

## Pre-requisites

1. `node` v20
1. `zip` terminal program
1. `cp` terminal program

## Instructions

1. Run `npm install` to retrieve packages
1. Set the environment variable `DEPLOYMENT_MODE=production`
1. Run the script at `./scripts/build.sh`

## Result
* All files copied to `./dist` directory
* Two main Javascript files: `bundle.js` and `popup.js`, containing the main
extension code and popup-specific code, respectively
* One additional Javascript file containing the
[polyfill](https://github.com/mozilla/webextension-polyfill)
* HTML and CSS for the popup window in the `html` directory
* Icons in the `icon` directory
* A zip file containing the contents of this directory