(function() {
  'use strict';
  angular.module('oblique-features')
  .directive('ofFeature', [/*'featuresService',*/ function(/*featuresService*/) {
    return {
      restrict: 'EA',
      transclude: true,
      scope: {
        feature: '@'
      },
      controller: ['$scope', 'featuresService', function($scope, featuresService) {
        $scope.checkFeatureEnabled = function(featureName) {
          return featuresService.checkFeatureEnabled(featureName);
        };
        $scope.toggleFeatureEnabled = function(featureName) {
          return featuresService.toggleFeatureEnabled(featureName);
        };
      }],
      template: '<span ng-if="checkFeatureEnabled(feature)" ng-transclude></span>'
    };
  }]);
})();
