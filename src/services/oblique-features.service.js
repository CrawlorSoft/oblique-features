(function() {
  'use strict';
  /**
   * @ngdoc service
   * @name featuresService
   * @description
   * The featuresService is the main point of interaction between the `oblique-features` module and AngularJS
   * code. This service proivdes the following interaction capabilities:
   *
   * 1. Checking feature enabled / disabled status; and
   * 2. Toggling individual features; and
   * 3. Setting data dictionaries of enabled / disabled features from:
   *   1. Hard-coded JSON sources; or
   *   2. Remote JSON sources a single time or on a repeating schedule.
   *
   * ## Checking Feature Status
   *
   * In order to determine if a feature should be enabled or disabled, the service provides the
   * `checkFeatureEnabled(featureName)`.  This function will return true if the feature is either explicitly
   * enabled or is omitted from the data set or false if the feature is explicitly disabled.
   *
   * ### Base Required For All Other Features?
   *
   * If desired, it is possible for the enabled / disabled status of individual features to be influenced by whether
   * or not the base feature is enabled.  If, for example, a security flaw is found, it would be possible to disable
   * every feature by simply setting `base` to be false, and calling
   * `featuresService.setBaseRequiredForAllFeatures(true)`.
   *
   * At this point, if `base` ever becomes disabled, any element with an `of-feature` element will be disabled.
   *
   * ## Disabling Features
   * For ease of use and mitigation of unintended consequences, all features are enabled by default.  In order
   * to prevent a feature from being displayed, the feature must be disabled.  There are multiple ways of disabling
   * features in `oblique-features`:
   *
   * 1. Toggling the individual feature; or
   * 2. Setting a feature dictionary with the feature disabled; or
   * 3. Setting a remote JSON file with the desired features disabled in it.
   *
   * ### Toggling Individual Features
   * This is more useful for testing applications, to ensure that when a feature is disabled, all of the
   * relevant items are hidden and that it does not have any adverse effect on the remainder of the web application.
   *
   * To toggle an individual feature, one could set up the AngularJS JavaScript as follows:
    <example>
    angular.module('some-module').controller('someController', ['featuresService', function(featuresService) {
      this.toggleFeature = function(featureName) {
        featuresService.toggleFeature(featureName);
      }
    }]);
    </example>
   * And then have an HTML setup as follows:
    ```html
    <div class="someFeatureDiv" of-feature feature="disableMe">
      <!-- Some content goes here -->
    </div>
    <button ng-click="ctrl.toggleFeature('disableMe')">Disable Feature</button>
    ```
   * ### Disabling Features Via Hard-Coded JSON Data
   * This functionality is most useful if it is unlikely that deployed functionality will need to be adjusted on the
   * fly.  In this method of feature disabling, the hard-coded JSON source is passed into the service and will
   * over-write any other feature enabled / disabled status which had been previously set.  As an example:
   *
   <example>
    angular.module('some-module').controller('someController', ['featuresService', function(featuresService) {
      var jsonData = {
        base: true,
        signup: false,
        accountDeletion: false,
        dataViewing: true
      };
      featuresService.setHardCodedSource(jsonData);
    }]);
   </example>
   *
   * In this example, signup and accountDeletion functionality would be disabled while all other functionality would
   * be enabled.
   *
   * ### Disabling Features Via Remote JSON Data
   * This functionality is most useful if there is a high probability that functionality will need to be enabled /
   * disabled on the fly without a full re-deploy of the web application.  In this case, the functionality dictionary
   * needs to be deployed to a known URI which can be passed in to the setRemoteSource method.
   *
   * With the remote source, it is also possible to set a timeout to retrieve the remote source again to facilitate
   * hot-disabling of functionality within a certain timeframe.  Taking the JSON data from the above example, if it were
   * to be placed at http://foofoo.net/features.json, could be retrieved every 5 minutes by doing the following:
   *
   <example>
    angular.module('some-module').controller('someController', ['featuresService', function(featuresService) {
      featuresService.setRemoteSource('http://foofoo.net/features.json', 5*60*1000);
    }]);
   </example>
   *
   *
   */
  angular.module('oblique-features')
  .factory('featuresService',
    ['$log', '$http', '$interval', '$rootScope',
    function($log, $http, $interval, $rootScope) {
      var FeaturesService = {
        remoteSource: null,
        intervalId: null,
        baseRequiredForAllFeatures: false,
        featuresEnabledStatus: {
          base: true
        }
      };
      FeaturesService.checkFeatureEnabled = function(featureName) {
        featureName = featureName ? featureName : 'base';
        if (FeaturesService.baseRequiredForAllFeatures) {
          return (FeaturesService.featuresEnabledStatus.base &&
            (FeaturesService.featuresEnabledStatus[featureName] === true ||
              FeaturesService.featuresEnabledStatus[featureName] === undefined));
        } else {
          return (FeaturesService.featuresEnabledStatus[featureName] ||
            FeaturesService.featuresEnabledStatus[featureName] === undefined);
        }
      };

      FeaturesService.toggleFeature = function(featureName) {
        if (!featureName) {
          featureName = 'base';
        }
        if (undefined === FeaturesService.featuresEnabledStatus[featureName]) {
          FeaturesService.featuresEnabledStatus[featureName] = false;
        } else {
          FeaturesService.featuresEnabledStatus[featureName] = !FeaturesService.featuresEnabledStatus[featureName];
        }
      };

      FeaturesService.setFeatureEnabledData = function(data) {
        if (undefined === data.base) {
          data.base = true;
        }
        FeaturesService.featuresEnabledStatus = data;
      };

      FeaturesService.setBaseRequiredForAllFeatures = function(reqdForAll) {
        FeaturesService.baseRequiredForAllFeatures = reqdForAll;
      };

      FeaturesService.setRemoteSource = function(sourceURI, repeatIn, repeatCount) {
        FeaturesService.remoteSource = sourceURI;
        FeaturesService.checkRemoteSource();
        if (FeaturesService.intervalId) {
          $interval.cancel(FeaturesService.intervalId);
        }
        if (repeatIn) {
          FeaturesService.intervalId = $interval(FeaturesService.checkRemoteSource, repeatIn, repeatCount);
          if (repeatIn < 60000) {
            $log.warn('setRemoteSource: Checking source at extremely short intervals is not advised.');
          }
        }
      };

      FeaturesService.checkRemoteSource = function() {
        if (!FeaturesService.remoteSource) {
          $log.warn('checkRemoteSource: No remote source has been set, returning');
          return;
        }
        var promise = $http.get(FeaturesService.remoteSource);
        var self = FeaturesService;
        promise.then(function(response) {
          self.setFeatureEnabledData(response.data);
          return response.data;
        })
        .catch(function(errorResponse) {
          var errorData = {
            status: errorResponse.status,
            method: errorResponse.config.method,
            url: errorResponse.config.url,
            statusText: errorResponse.statusText,
            data: errorResponse.data
          };
          $log.error('checkRemoteSource: Errors encountered retrieving feature status information: ', errorData);
        });
        return promise;
      };

      FeaturesService.setHardCodedSource = function(data) {
        FeaturesService.setFeatureEnabledData(data);
        if (FeaturesService.intervalId) {
          $interval.cancel(FeaturesService.intervalId);
          FeaturesService.intervalId = null;
        }
      };
      return FeaturesService;
    }]);
})();
