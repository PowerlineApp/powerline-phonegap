describe('Activity', function () {

  beforeEach(module('app.services'));

  var $httpBackend,
    url
    ;

  beforeEach(inject(function ($injector, serverConfig) {
    $httpBackend = $injector.get('$httpBackend');
    url = serverConfig.url;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

});