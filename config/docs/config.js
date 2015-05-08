(function() {
  'use strict';

  var path = require('canonical-path');

  var Package = require('dgeni').Package;

  module.exports = new Package('oblique-features', [
    require('dgeni-packages/ngdoc'),
    require('dgeni-packages/nunjucks')
  ]).config(function(log, readFilesProcessor, templateFinder, writeFilesProcessor) {
    log.level = 'info';
    readFilesProcessor.basePath = path.resolve(__dirname, '../..');
    console.log('docs base path:  ', readFilesProcessor.basePath);

    readFilesProcessor.sourceFiles = [{
      include: 'src/{,**/}*.js',
      basePath: 'src'
    }];

    templateFinder.templateFolders.unshift(path.resolve(__dirname, 'templates'));

    templateFinder.templatePatterns.unshift('common.template.html');

    writeFilesProcessor.outputFolder = 'buildreports/docs/';
  });


})();
