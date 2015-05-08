(function() {
  'use strict';
  should = chai.should();
  chai.config.truncateThreshold = 0;
  chai.use(chaiAsPromised);

  describe('of-feature directive', function() {
    var element;
    var scope;
    beforeEach(module('oblique-features'));

    var mockFeatureService = {
      base: true,
      other: false,
      checkFeatureEnabled: function(feature) {
        if (feature === 'base') {
          return mockFeatureService.base;
        } else {
          return mockFeatureService.other;
        }
      },
      toggleFeatureEnabled: function(feature) {
        if (feature === 'base') {
          mockFeatureService.base = !mockFeatureService.base;
        } else {
          mockFeatureService.other = !mockFeatureService.other;
        }
      }
    };

    beforeEach(module(function($provide) {
      $provide.value('featuresService', mockFeatureService);
    }));

    describe('Empty feature', function() {
      beforeEach(inject(function($rootScope, $compile) {
        scope = $rootScope.$new();
        element = '<div of-feature></div>';

        element = $compile(element)(scope);
        scope.$digest();
      }));

      it('should not have a feature name', function() {
        var isolated = element.isolateScope();
        should.not.exist(isolated.feature);
      });
      it('should check the provided feature name', function() {
        var isolated = element.isolateScope();
        isolated.checkFeatureEnabled('base').should.not.equal(isolated.checkFeatureEnabled('other'));
      });
      it('should toggle the feature value', function() {
        var isolated = element.isolateScope();
        isolated.toggleFeatureEnabled('base');
        isolated.checkFeatureEnabled('base').should.equal(isolated.checkFeatureEnabled('other'));
      });
    });
  });
})();
