(function() {
  'use strict';
  // Test for correct behaviour when no data is set into the feature system.

  describe('No Data Set', function() {
    // Title feature elements
    var pageTitle;
    var introTitle;
    var noFeaturesTitle;
    var tableTitle;
    var visualTitle;
    var spanTitle;
    var featureOneParaOne;
    var featureOneParaTwo;
    var featurelessParagraph;
    var spanFeatureOne;
    var featureTwoParagraph2;
    var featureTwoSpanOne;
    var featureTwoSpanTwo;
    var introParagraph;
    var featuresParagraph;
    var spanBaseOne;
    var spanBaseTwo;
    var requireBaseCheckbox;
    // Button Elements
    var btnDisableBase;
    var btnEnableBase;

    var validateDisplay = function(element, value) { expect(element.isDisplayed()).toBe(value); };
    var validateChecked = function(element, value) { expect(element.getAttribute('checked')).toBe(value); };

    beforeEach(function() {
      browser.get('/');
      pageTitle = element(by.id('pageTitle'));
      introTitle = element(by.id('introTitle'));
      noFeaturesTitle = element(by.id('noFeaturesTitle'));
      visualTitle = element(by.id('visualTitle'));
      spanTitle = element(by.id('spanTitle'));
      featureOneParaOne = element(by.id('featureOneParagraph1'));
      featureOneParaTwo = element(by.id('featureOneParagraph2'));
      featurelessParagraph = element(by.id('featurelessParagraph'));
      spanFeatureOne = element(by.id('spanFeatureOne'));
      featureTwoParagraph2 = element(by.id('featureTwoParagraph2'));
      featureTwoSpanOne = element(by.id('featureTwoSpanOne'));
      featureTwoSpanTwo = element(by.id('spanFeatureTwo'));
      introParagraph = element(by.id('introParagraph'));
      featuresParagraph = element(by.id('featuresParagraph'));
      spanBaseOne = element(by.id('spanBaseOne'));
      spanBaseTwo = element(by.id('spanBaseTwo'));
      requireBaseCheckbox = element(by.model('featureBaseRequiredValue'));
      btnEnableBase = element(by.id('btnEnableBase'));
      btnDisableBase = element(by.id('btnDisableBase'));
    });

    it('should display all elements initially.', function() {
      // Titles
      validateDisplay(pageTitle, true);
      validateDisplay(introTitle, true);
      validateDisplay(noFeaturesTitle, true);
      validateDisplay(visualTitle, true);
      validateDisplay(spanTitle, true);
      // Feature One
      validateDisplay(featureOneParaOne, true);
      validateDisplay(featureOneParaTwo, true);
      validateDisplay(featurelessParagraph, true);
      validateDisplay(spanFeatureOne, true);
      // Feature two
      validateDisplay(featureTwoSpanOne, true);
      validateDisplay(featureTwoSpanTwo, true);
      validateDisplay(featureTwoParagraph2, true);
      // Base features
      validateDisplay(featuresParagraph, true);
      validateDisplay(introParagraph, true);
      validateDisplay(spanBaseOne, true);
      validateDisplay(spanBaseTwo, true);
    });

    it('should have all features enabled initially', function() {
      validateChecked(requireBaseCheckbox, null);
    });

    describe('Base feature functionality', function() {
      it('should only modify base features if base is not required for all features.', function() {
        btnDisableBase.click();
        validateDisplay(pageTitle, true);
        validateDisplay(introTitle, true);
        validateDisplay(noFeaturesTitle, true);
        validateDisplay(visualTitle, true);
        validateDisplay(spanTitle, true);
        validateDisplay(featureOneParaOne, true);
        validateDisplay(featureOneParaTwo, true);
        validateDisplay(featurelessParagraph, true);
        validateDisplay(spanFeatureOne, true);
        validateDisplay(featureTwoSpanOne, true);
        validateDisplay(featureTwoSpanTwo, true);
        validateDisplay(featureTwoParagraph2, true);
        validateDisplay(introParagraph, false);
        validateDisplay(featuresParagraph, false);
        validateDisplay(spanBaseOne, false);
        validateDisplay(spanBaseTwo, false);
        btnEnableBase.click();
        validateDisplay(pageTitle, true);
        validateDisplay(introTitle, true);
        validateDisplay(noFeaturesTitle, true);
        validateDisplay(visualTitle, true);
        validateDisplay(spanTitle, true);
        validateDisplay(featureOneParaOne, true);
        validateDisplay(featureOneParaTwo, true);
        validateDisplay(featurelessParagraph, true);
        validateDisplay(spanFeatureOne, true);
        validateDisplay(featureTwoSpanOne, true);
        validateDisplay(featureTwoSpanTwo, true);
        validateDisplay(featureTwoParagraph2, true);
        validateDisplay(introParagraph, true);
        validateDisplay(featuresParagraph, true);
        validateDisplay(spanBaseOne, true);
        validateDisplay(spanBaseTwo, true);
      });
      it('should disable all features if base is required and disabled.', function() {
        btnDisableBase.click();
        requireBaseCheckbox.click();
        validateChecked(requireBaseCheckbox, 'true');
        validateDisplay(pageTitle, true);
        validateDisplay(introTitle, false);
        validateDisplay(noFeaturesTitle, false);
        validateDisplay(visualTitle, false);
        validateDisplay(spanTitle, false);
        validateDisplay(featurelessParagraph, true);
        validateDisplay(spanFeatureOne, false);
        validateDisplay(featureTwoSpanOne, false);
        validateDisplay(featureTwoSpanTwo, false);
        validateDisplay(introParagraph, false);
        validateDisplay(featuresParagraph, false);
        validateDisplay(spanBaseOne, false);
        validateDisplay(spanBaseTwo, false);
        btnEnableBase.click();
        validateDisplay(pageTitle, true);
        validateDisplay(introTitle, true);
        validateDisplay(noFeaturesTitle, true);
        validateDisplay(visualTitle, true);
        validateDisplay(spanTitle, true);
        validateDisplay(featureOneParaOne, true);
        validateDisplay(featureOneParaTwo, true);
        validateDisplay(featurelessParagraph, true);
        validateDisplay(spanFeatureOne, true);
        validateDisplay(featureTwoSpanOne, true);
        validateDisplay(featureTwoSpanTwo, true);
        validateDisplay(featureTwoParagraph2, true);
        validateDisplay(introParagraph, true);
        validateDisplay(featuresParagraph, true);
        validateDisplay(spanBaseOne, true);
        validateDisplay(spanBaseTwo, true);
      });

      it('should re-enable disabled features after 1 second.', function() {
        var titleCheckbox = element(by.model('featureTitleValue'));
        var btnEnableTimeout = element(by.id('btnTimedEnable'));
        btnDisableBase.click();
        requireBaseCheckbox.click();
        validateChecked(requireBaseCheckbox, 'true');
        validateDisplay(pageTitle, true);
        validateDisplay(introTitle, false);
        validateDisplay(noFeaturesTitle, false);
        validateDisplay(visualTitle, false);
        validateDisplay(spanTitle, false);
        validateDisplay(featurelessParagraph, true);
        validateDisplay(spanFeatureOne, false);
        validateDisplay(featureTwoSpanOne, false);
        validateDisplay(featureTwoSpanTwo, false);
        validateDisplay(introParagraph, false);
        validateDisplay(featuresParagraph, false);
        validateDisplay(spanBaseOne, false);
        validateDisplay(spanBaseTwo, false);
        btnEnableTimeout.click();
        titleCheckbox.click();
        validateDisplay(visualTitle, false);
        browser.wait(element(by.id('visualTitle')).isDisplayed, 1500, 'visualTitle did not re-appaer');
      });
    });
  });
})();
