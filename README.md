# oblique-features

The `oblique-features` AngularJS module is intended to permit the enabling and disabling of
features in a web application either through hard coded data sources or the use of a
remote URI to retrieve feature enablement data once or on a set schedule.

## Table of Contents

1. [Installation](https://github.com/CrawlorSoft/oblique-features#installation)
2. [Features](https://github.com/CrawlorSoft/oblique-features#features)
3. [Usage](https://github.com/CrawlorSoft/oblique-features#usage)
  * [Checking Feature Status](https://github.com/CrawlorSoft/oblique-features#checking-feature-status)
      * [Base Requirement](https://github.com/CrawlorSoft/oblique-features#base-required-for-all-other-features)
  * [Disabling Features](https://github.com/CrawlorSoft/oblique-features#disabling-features)
      * [Toggling Individual Features](https://github.com/CrawlorSoft/oblique-features#toggling-individual-features)
      * [Disabling Features Via Hard-Coded JSON](https://github.com/CrawlorSoft/oblique-features#disabling-features-via-hard-coded-json-data)
      * [Disabling Features Via Remote JSON](https://github.com/CrawlorSoft/oblique-features#disabling-features-via-remote-json-data)
4. [Thank You](https://github.com/CrawlorSoft/oblique-features#thank-you)
5. [TODOs](https://github.com/CrawlorSoft/oblique-features#todos)
6. [Sample](https://github.com/CrawlorSoft/oblique-features#sample)

## Installation

`bower install --save oblique-features`

or

`npm install --save-dev oblique-features`

## Building From Source

It is possible to build `oblique-features` from source.  In order to do this:

1. Clone out this repository.
2. Ensure you have gulp installed (`npm install -g gulp`)
3. Install the NPM and Bower dependencies: `npm install && bower install`
4. Build: `gulp`

## Features

1. Feature status checking:
  1. Defaults to enabled unless explicitly disabled.
2. Setting feature enabled / disabled data via hard-coded data sources.
3. Setting feature enabled / disabled data via remote data sources:
  1. Single time, fire and forget, retrieval of JSON data; or
  2. Infinite, timed retrieval of JSON data; or
  3. Count limited, timed retrieval of JSON data.

## Usage

To begin using `oblique-features` simply add the `of-feature` attribute to any HTML element **or**
enclose a set of HTML tags in a `<of-feature>...</of-feature>` tag set.

If no `feature="someFeatureName"` attribute is found in either an of-feature HTML element or an HTML
element containing the of-feature attribute, that HTML element is assumed to belong to the `base` feature.

### Checking Feature Status

In order to determine if a feature should be enabled or disabled, the service provides the
`checkFeatureEnabled(featureName)`.  This function will return true if the feature is either explicitly
enabled or is omitted from the data set or false if the feature is explicitly disabled.

#### Base Required For All Other Features?

If desired, it is possible for the enabled / disabled status of individual features to be influenced by whether
or not the base feature is enabled.  If, for example, a security flaw is found, it would be possible to disable
every feature by simply setting `base` to be false, and calling
`featuresService.setBaseRequiredForAllFeatures(true)`.

At this point, if `base` ever becomes disabled, any element with an `of-feature` element will be disabled.

### Disabling Features
For ease of use and mitigation of unintended consequences, all features are enabled by default.  In order
to prevent a feature from being displayed, the feature must be disabled.  There are multiple ways of disabling
features in `oblique-features`:

1. Toggling the individual feature; or
2. Setting a feature dictionary with the feature disabled; or
3. Setting a remote JSON file with the desired features disabled in it.

#### Toggling Individual Features
This is more useful for testing applications, to ensure that when a feature is disabled, all of the
relevant items are hidden and that it does not have any adverse effect on the remainder of the web application.

To toggle an individual feature, one could set up the AngularJS JavaScript as follows:
```JavaScript
  angular.module('some-module').controller('someController', ['featuresService', function(featuresService) {
    this.toggleFeature = function(featureName) {
      featuresService.toggleFeature(featureName);
    }
  }]);
```
And then have an HTML setup as follows:
```HTML
  <div class="someFeatureDiv" of-feature feature="disableMe">
    <!-- Some content goes here -->
  </div>
  <button ng-click="ctrl.toggleFeature('disableMe')">Disable Feature</button>
```
#### Disabling Features Via Hard-Coded JSON Data
This functionality is most useful if it is unlikely that deployed functionality will need to be adjusted on the
fly.  In this method of feature disabling, the hard-coded JSON source is passed into the service and will
over-write any other feature enabled / disabled status which had been previously set.  As an example:

```JavaScript
  angular.module('some-module').controller('someController', ['featuresService', function(featuresService) {
    var jsonData = {
      base: true,
      signup: false,
      accountDeletion: false,
      dataViewing: true
    };
    featuresService.setHardCodedSource(jsonData);
  }]);
```

In this example, signup and accountDeletion functionality would be disabled while all other functionality would
be enabled.

#### Disabling Features Via Remote JSON Data
This functionality is most useful if there is a high probability that functionality will need to be enabled /
disabled on the fly without a full re-deploy of the web application.  In this case, the functionality dictionary
needs to be deployed to a known URI which can be passed in to the setRemoteSource method.

With the remote source, it is also possible to set a timeout to retrieve the remote source again to facilitate
hot-disabling of functionality within a certain timeframe.  Taking the JSON data from the above example, if it were
to be placed at http://foofoo.net/features.json, could be retrieved every 5 minutes by doing the following:

```JavaScript
  angular.module('some-module').controller('someController', ['featuresService', function(featuresService) {
    featuresService.setRemoteSource('http://foofoo.net/features.json', 5601000);
  }]);
```

## Thank You

I would like to thank my employer, [Employii](http://www.employii.com) for permitting me to re-write and open source
an element of our web application which I feel will be beneficial for the AngularJS community at large.

## TODOs

The following are items I intend to get to in the near future:

1. An angular-meteor implementation which can read status from MongoDB.
2. Setting up the `oblique-features` wiki with better examples.
3. Setting up a samples section which will display the module working in various formats.

## Sample

Currently, the web page which is used for the e2e tests in the repo can be used for a brief and limited overview of
the functionality of this module.

Execution:

1. In the oblique-features directory, execute: `gulp serve`.
2. Navigate to: `https://localhost:9000/`
