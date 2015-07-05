describe('Representatives controller', function () {

  beforeEach(module('app.controllers'));

  var $httpBackend, url;

  beforeEach(inject(function ($injector, serverConfig) {
    $httpBackend = $injector.get('$httpBackend');
    url = serverConfig.url;
  }));

  it('should load my representatives', inject(function ($rootScope, $controller) {
    $httpBackend.expectGET(url + '/api/representatives\\').respond(200, [
      {}
    ]);
    var scope = $rootScope.$new();
    $controller('representatives', {
      $scope: scope
    });

    expect(scope.items.length).toEqual(0);

    $httpBackend.flush();
    expect(scope.items.length).toEqual(1);

  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

});
