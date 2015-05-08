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
    // Checkbox elements
    var titleCheckbox;
    var featureOneCheckbox;
    var featureTwoCheckbox;
    var featureBaseCheckbox;
    var requireBaseCheckbox;

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
      titleCheckbox = element(by.model('featureTitleValue'));
      featureOneCheckbox = element(by.model('featureOneValue'));
      featureTwoCheckbox = element(by.model('featureTwoValue'));
      featureBaseCheckbox = element(by.model('featureBaseValue'));
      requireBaseCheckbox = element(by.model('featureBaseRequiredValue'));
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
      validateChecked(titleCheckbox, 'true');
      validateChecked(featureOneCheckbox, 'true');
      validateChecked(featureTwoCheckbox, 'true');
      validateChecked(featureBaseCheckbox, 'true');
      validateChecked(requireBaseCheckbox, null);
    });

    describe('Title feature functionality', function() {
      afterEach(function() {
        // Verify no other features are affected.
        validateDisplay(featureOneParaOne, true);
        validateDisplay(featureOneParaTwo, true);
        validateDisplay(featurelessParagraph, true);
        validateDisplay(spanFeatureOne, true);
        validateDisplay(featureTwoSpanOne, true);
        validateDisplay(featureTwoSpanTwo, true);
        validateDisplay(featureTwoParagraph2, true);
      });
      it('should show only the page title when titles are disabled', function() {
        titleCheckbox.click();
        validateChecked(titleCheckbox, null);
        validateDisplay(pageTitle, true);
        validateDisplay(introTitle, false);
        validateDisplay(noFeaturesTitle, false);
        validateDisplay(visualTitle, false);
        validateDisplay(spanTitle, false);
      });
    });

    describe('FeatureOne functionality', function() {
      afterEach(function() {
        validateDisplay(pageTitle, true);
        validateDisplay(introTitle, true);
        validateDisplay(noFeaturesTitle, true);
        validateDisplay(visualTitle, true);
        validateDisplay(spanTitle, true);
        validateDisplay(featureTwoSpanOne, true);
        validateDisplay(featureTwoSpanTwo, true);
      });
      it('should show only the featureless paragraph when feature one is disabled', function() {
        featureOneCheckbox.click();
        validateChecked(featureOneCheckbox, null);
        validateDisplay(featurelessParagraph, true);
        validateDisplay(spanFeatureOne, false);
      });
    });

    describe('FeatureTwo functionality', function() {
      afterEach(function() {
        validateDisplay(pageTitle, true);
        validateDisplay(introTitle, true);
        validateDisplay(noFeaturesTitle, true);
        validateDisplay(visualTitle, true);
        validateDisplay(spanTitle, true);
        validateDisplay(featureOneParaOne, true);
        validateDisplay(featureOneParaTwo, true);
        validateDisplay(featurelessParagraph, true);
        validateDisplay(spanFeatureOne, true);
      });
      it('should not show the featureTwo spans when feature two is disabled', function() {
        featureTwoCheckbox.click();
        validateDisplay(featureTwoSpanOne, false);
        validateDisplay(featureTwoSpanTwo, false);
        validateDisplay(featureTwoParagraph2, false);
      });
    });

    describe('Base feature functionality', function() {
      it('should only modify base features if base is not required for all features.', function() {
        featureBaseCheckbox.click();
        validateChecked(featureBaseCheckbox, null);
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
      });
      it('should disable all features if base is required and disabled.', function() {
        featureBaseCheckbox.click();
        requireBaseCheckbox.click();
        validateChecked(featureBaseCheckbox, null);
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
      });
    });
  });
})();
