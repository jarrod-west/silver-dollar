# Silver Dollar

_Eucalyptus Cinerea, a.k.a. The Silver Dollar Gum, is a species of gum tree_
_known for being particularly small and compact_

## Overview

The practice of [spamdexing](https://en.wikipedia.org/wiki/Spamdexing) is alive
and well on `gumtree.com`, with unscrupulous sellers able to manipulate search
results by adding a serious of keyword "tags" at the end of their description.

This appears to be especially egregious from car dealerships, and so searching
for a specific make of car often requires wading through a huge number of
entirely unrelated listings.

This extension aims to resolve that by detecting and highlighting these
suspect results, leaving the user free to concentrate on what they're actually
looking for.

## How it works

As each page loads, the extension will parse the contents and determine whether
the listing matches the search. It does this by considering the title against
each word in the search query, using fuzzy logic to allow imperfect matches.

If a listing fails to meet the required match threshold, rather than being
removed entirely it will be rendered mostly transparent. This allows the user
to easily skim past these listings, while still allowing them to be viewed
if desired.

Here's an example (note that this screenshot has had some identifying features
from both result sets blurred for privacy).

![](images/example.png)

## Settings

* `Enabled` - Used to entirely disable the extension
* `Transparency` - Adjusts the level of transparency that filtered-out listings
will be rendered as. Goes from 0 (fully opaque) to 100 (fully transparent)
* `Fuzziness` - Used to modify the fuzzy logic threshold for determining whether
a listing matches the search query. Higher values increase the chance of
a positive match. Note that having some fuzziness allows for small differences
like casing, hyphens instead of spaces, minor spelling errors, etc.
* `Title Only` - Whether to only consider the listing title when matching, or
whether to also include the reduced description that's present on the search
results page. If the latter, note that listings that include the spam tags
towards the top of their description will likely have them present here,
leading to false positives.

## Development

This extension is written in typescript, using webpack to bundle it for
deployment.  There are three deployable output scripts:

* bundle.js - the main extension
* popup.js - the settings popup
* browser-polyfill.js - a webextension-specific polyfill

To package the extension, run the script at `./scripts/build.sh`. By default
the package will be in `development` mode: to run as `production` set the
environment variable `DEPLOYMENT_MODE=production`.

Some notable npm scripts:
* `prettier:check` and `prettier:write` - run prettifying checks, with or
without automatic fixes.
* `lint` - run linting
* `test` and `test:coverage` - run unit tests, with or without a coverage
report
* `pre-push` - run prettier and lint in sequence. This is run as a hook on
`git push`

# TODO:

* Restrict URL to only search results ("/s-*", maybe?)
* Better CSS, including (inherited) dark mode
* Github action to auto-deploy?
* Multi-browser PARTIAL
* Better logging
