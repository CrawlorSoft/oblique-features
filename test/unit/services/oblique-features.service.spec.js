(function() {
  should = chai.should();
  chai.config.truncateThreshold = 0;
  chai.use(chaiAsPromised);

  describe('Service: featuresService', function() {
    var serv;
    var logServ;
    var intervalServ;

    beforeEach(module('oblique-features'));

    beforeEach(inject(function(_featuresService_, $log, $interval) {
      serv = _featuresService_;
      logServ = $log;
      intervalServ = $interval;
    })); // beforeEach -> service injection

    describe('Initialization', function() {
      afterEach(function() {
        logServ.assertEmpty();
      });

      it('should not have a file source initially.', function() {
        should.not.exist(serv.remoteSource);
      });

      it('should not have an interval ID initially.', function() {
        should.not.exist(serv.intervalId);
      });

      it('should not require base to be enabled for all feaures.', function() {
        serv.baseRequiredForAllFeatures.should.be.false;
      });

      it('should only have base enabled.', function() {
        for (var idx in serv.featuresEnabledStatus) {
          idx.should.eql('base');
          serv.featuresEnabledStatus[idx].should.be.true;
        }
      });
    }); // Initialiazation block

    describe('setFeatureEnabledData', function() {
      afterEach(function() {
        logServ.assertEmpty();
      });

      it('should set base to be true if it is not provided in incoming data', function() {
        serv.featuresEnabledStatus.base = false;
        serv.setFeatureEnabledData({});
        serv.featuresEnabledStatus.base.should.be.true;
        should.exist(serv.featuresEnabledStatus.base);
      });
      it('should not change base if it is provided in incoming data.', function() {
        serv.setFeatureEnabledData({base: false});
        serv.featuresEnabledStatus.base.should.be.false;
        should.exist(serv.featuresEnabledStatus.base);
      });
      it('should only modify base and nothing else in incoming data.', function() {
        serv.setFeatureEnabledData({base1: false, bas: false, bob: true});
        serv.featuresEnabledStatus.base.should.be.true;
        serv.featuresEnabledStatus.base1.should.be.false;
        serv.featuresEnabledStatus.bas.should.be.false;
        serv.featuresEnabledStatus.bob.should.be.true;
        should.exist(serv.featuresEnabledStatus.base);
      });
    }); // setFeatureEnabledData block

    describe('setBaseRequiredForAllFeatures', function() {
      afterEach(function() {
        logServ.assertEmpty();
      });

      it('should modify the base value as necessary.', function() {
        serv.baseRequiredForAllFeatures.should.be.false;
        serv.setBaseRequiredForAllFeatures(true);
        serv.baseRequiredForAllFeatures.should.be.true;
        serv.setBaseRequiredForAllFeatures(false);
        serv.baseRequiredForAllFeatures.should.be.false;
      });
    }); // setBaseRequiredForAllFeatures

    describe('checkFeatureEnabled', function() {
      afterEach(function() {
        logServ.assertEmpty();
      });

      it('should return the currently set value for base if no feature name provided.', function() {
        serv.checkFeatureEnabled().should.be.true;
        serv.setFeatureEnabledData({base: false});
        serv.checkFeatureEnabled().should.be.false;
        serv.setFeatureEnabledData({});
        serv.checkFeatureEnabled().should.be.true;
      });
      it('should return true if the feature name is not explicitly set to be disabled.', function() {
        serv.checkFeatureEnabled('random non existing feature').should.be.true;
      });
      it('should return true if the feature is explicitly set to true.', function() {
        serv.setFeatureEnabledData({someTrueFeature: true});
        serv.checkFeatureEnabled('someTrueFeature').should.be.true;
      });
      it('should return false if the feature is explicitly set to false.', function() {
        serv.setFeatureEnabledData({someFalseFeature: false});
        serv.checkFeatureEnabled('someFalseFeature').should.be.false;
      });
      it('should not care if base is true or false by default.', function() {
        serv.setFeatureEnabledData({someTrueFeature: true, base: false});
        serv.checkFeatureEnabled('someTrueFeature').should.be.true;
      });
      it('should return false if base is required and false regardless of the feature status.', function() {
        serv.setFeatureEnabledData({someTrueFeature: true, base: false});
        serv.setBaseRequiredForAllFeatures(true);
        serv.checkFeatureEnabled('someTrueFeature').should.be.false;
        serv.checkFeatureEnabled().should.be.false;
        serv.featuresEnabledStatus.someTrueFeature.should.be.true;
      });
      it('should return true if base and the feature are enabled and base is required.', function() {
        serv.setFeatureEnabledData({someTrueFeature: true, base: true});
        serv.setBaseRequiredForAllFeatures(true);
        serv.checkFeatureEnabled('someTrueFeature').should.be.true;
        serv.checkFeatureEnabled().should.be.true;
      });
      it('should return false if base is true, feature is false and base is required.', function() {
        serv.setFeatureEnabledData({someFalseFeature: false, base: true});
        serv.setBaseRequiredForAllFeatures(true);
        serv.checkFeatureEnabled('someFalseFeature').should.be.false;
        serv.checkFeatureEnabled().should.be.true;
      });
    }); // checkFeatureEnabled

    describe('toggleFeature', function() {
      afterEach(function() {
        logServ.assertEmpty();
      });

      it('should toggle base with no feature name provided for symmetry with checkFeatureEnabled.', function() {
        serv.checkFeatureEnabled().should.be.true;
        serv.toggleFeature();
        serv.checkFeatureEnabled().should.be.false;
        serv.toggleFeature();
        serv.checkFeatureEnabled().should.be.true;
      });
      it('should toggle base when base is provided as the feature name.', function() {
        serv.checkFeatureEnabled().should.be.true;
        serv.toggleFeature('base');
        serv.checkFeatureEnabled().should.be.false;
        serv.toggleFeature('base');
        serv.checkFeatureEnabled().should.be.true;
      });
      it('should set a previously non-existent feature to false.', function() {
        serv.checkFeatureEnabled('someOddFeature').should.be.true;
        serv.toggleFeature('someOddFeature');
        serv.checkFeatureEnabled('someOddFeature').should.be.false;
      });
      it('should not affect any feature other than the named one.', function() {
        serv.setFeatureEnabledData({base: false, someFeature: true, someOtherFeature: true});
        serv.toggleFeature('someOddFeature');
        serv.checkFeatureEnabled().should.be.false;
        serv.checkFeatureEnabled('someOddFeature').should.be.false;
        serv.checkFeatureEnabled('someFeature').should.be.true;
        serv.checkFeatureEnabled('someOtherFeature').should.be.true;
      });
    }); // toggleFeature

    describe('setHardCodedSource', function() {
      afterEach(function() {
        logServ.assertEmpty();
      });

      it('should behave similarly to setFeatureEnabledData when passed data structures with no interval set.',
        function() {
          serv.setHardCodedSource({});
          serv.checkFeatureEnabled().should.be.true;
          serv.checkFeatureEnabled('base').should.be.true;
          should.exist(serv.featuresEnabledStatus.base);
          serv.setHardCodedSource({base: false});
          serv.checkFeatureEnabled().should.be.false;
          serv.checkFeatureEnabled('base').should.be.false;
          should.exist(serv.featuresEnabledStatus.base);
          serv.setHardCodedSource({bob: false});
          serv.checkFeatureEnabled().should.be.true;
          serv.checkFeatureEnabled('base').should.be.true;
          should.exist(serv.featuresEnabledStatus.base);
          serv.checkFeatureEnabled('bob').should.be.false;
          should.exist(serv.featuresEnabledStatus.bob);
        });
      it('should cancel an interval if intervalId exists.', function() {
        serv.intervalId = 1;
        serv.setHardCodedSource({});
        should.not.exist(serv.intervalId);
      });
    }); // setHardCodedSource

    describe('checkRemoteSource', function() {
      var httpBackend;
      var sourceURI = 'http://127.0.0.1/features.json';

      beforeEach(inject(function($httpBackend) {
        httpBackend = $httpBackend;
        httpBackend.verifyNoOutstandingExpectation();
      })); // beforeEach -> $httpBackend injection

      afterEach(function() {
        httpBackend.verifyNoOutstandingRequest();
        logServ.assertEmpty();
      }); // afterEach

      it('should do nothing if no remote source has been set.', function() {
        serv.setHardCodedSource({featureOne: true, featureTwo: false});
        var featureStatus = angular.copy(serv.featuresEnabledStatus);
        serv.checkRemoteSource();
        serv.featuresEnabledStatus.should.eql(featureStatus);
        logServ.warn.logs[0].should.eql['checkRemoteSource: No remote source has been set, returning'];
        logServ.warn.logs = [];
      });

      it('should attempt to retrieve the remote source if it has been set.', function() {
        var jsonObj = {};
        httpBackend.expectGET(sourceURI).respond(200, jsonObj);
        serv.remoteSource = sourceURI;
        serv.checkRemoteSource();
        httpBackend.flush();
      });

      it('should set the feature enabled status information to the values retrieved from the source', function() {
        var jsonObj = {base: false, featureOne: true, featureTwo: false};
        httpBackend.expectGET(sourceURI).respond(200, jsonObj);
        serv.remoteSource = sourceURI;
        serv.checkRemoteSource();
        httpBackend.flush();
        serv.checkFeatureEnabled().should.be.false;
        serv.checkFeatureEnabled('featureOne').should.be.true;
        serv.checkFeatureEnabled('featureTwo').should.be.false;
      });

      it('should log an error on an error return from the retrieval.', function() {
        var responseData = {
          data: 'File Not Found',
          status: 404,
          method: 'GET',
          url: sourceURI,
          statusText: ''
        }
        httpBackend.expectGET(sourceURI).respond(404, 'File Not Found');
        serv.remoteSource = sourceURI;
        serv.checkRemoteSource();
        httpBackend.flush();
        logServ.error.logs.length.should.equal(1);
        logServ.error.logs[0].should.eql(
          ['checkRemoteSource: Errors encountered retrieving feature status information: ', responseData]);
        logServ.error.logs = [];
      });
    }); // checkRemoteSource

    describe('setRemoteSource', function() {
      var httpBackend;
      var sourceURI = 'http://127.0.0.1/features.json';

      beforeEach(inject(function($httpBackend) {
        httpBackend = $httpBackend;
        httpBackend.verifyNoOutstandingExpectation();
      })); // beforeEach -> $httpBackend injection

      afterEach(function() {
        httpBackend.verifyNoOutstandingRequest();
        logServ.assertEmpty();
      }); // afterEach

      it('should not create an interval if only the sourceURI is passed in', function() {
        var jsonObj = {base: false, featureOne: true, featureTwo: false};
        httpBackend.expectGET(sourceURI).respond(200, jsonObj);
        serv.setRemoteSource(sourceURI);
        httpBackend.flush();
        serv.checkFeatureEnabled().should.be.false;
        serv.checkFeatureEnabled('featureOne').should.be.true;
        serv.checkFeatureEnabled('featureTwo').should.be.false;
        should.not.exist(serv.intervalId);
      });

      it('should create an interval if repeatIn is passed in', function() {
        var jsonObj = {base: false, featureOne: true, featureTwo: false};
        httpBackend.expectGET(sourceURI).respond(200, jsonObj);
        serv.remoteSource = sourceURI;
        serv.setRemoteSource(sourceURI, 60000);
        httpBackend.flush();
        serv.checkFeatureEnabled().should.be.false;
        serv.checkFeatureEnabled('featureOne').should.be.true;
        serv.checkFeatureEnabled('featureTwo').should.be.false;
        should.exist(serv.intervalId);
        // Shoudl be no warnings since repeatIn is >= 1 minute.
        logServ.assertEmpty();
      });

      it('should warn if repeatIn is less than one minute', function() {
        var jsonObj = {base: false, featureOne: true, featureTwo: false};
        httpBackend.expectGET(sourceURI).respond(200, jsonObj);
        serv.remoteSource = sourceURI;
        serv.setRemoteSource(sourceURI, 59999);
        httpBackend.flush();
        serv.checkFeatureEnabled().should.be.false;
        serv.checkFeatureEnabled('featureOne').should.be.true;
        serv.checkFeatureEnabled('featureTwo').should.be.false;
        should.exist(serv.intervalId);
        logServ.warn.logs.length.should.equal(1);
        logServ.warn.logs[0].should.eql(
          ['setRemoteSource: Checking source at extremely short intervals is not advised.']);
        logServ.warn.logs = [];
      });

      it('should cancel an existing interval if one exists and repeatIn is passed in', function() {
        var jsonObj = {base: false, featureOne: true, featureTwo: false};
        httpBackend.expectGET(sourceURI).respond(200, jsonObj);
        serv.remoteSource = sourceURI;
        serv.setRemoteSource(sourceURI, 60000);
        httpBackend.flush();
        var initialIntervalPromise = angular.copy(serv.intervalId);
        httpBackend.expectGET(sourceURI).respond(200, jsonObj);
        serv.setRemoteSource(sourceURI, 60000);
        httpBackend.flush();
        serv.checkFeatureEnabled().should.be.false;
        serv.checkFeatureEnabled('featureOne').should.be.true;
        serv.checkFeatureEnabled('featureTwo').should.be.false;
        should.exist(serv.intervalId);
        initialIntervalPromise.should.not.eql(serv.intervalId);
      });
    }); // setRemoteSource
  });
})();

