describe('Groups controller', function () {

  beforeEach(module('app.controllers'));

  var $httpBackend, url;

  beforeEach(inject(function ($injector, serverConfig) {
    $httpBackend = $injector.get('$httpBackend');
    url = serverConfig.url;
    $httpBackend.whenGET(url + '/api/groups/popular').respond(200, []);
    $httpBackend.whenGET(url + '/api/groups/new').respond(200, []);
    $httpBackend.whenGET(url + '/api/groups/user-groups/').respond(200, []);
  }));

  it('should alert error when app cannot loads groups', inject(function ($rootScope, $controller) {
    $httpBackend.expectGET(url + '/api/groups\\').respond(500, [
      {}
    ]);

    var scope = $rootScope.$new(true);
    scope.alert = $rootScope.alert;
    spyOn(scope, 'alert');

    $controller('groups', {
      $scope: scope,
      $window: window
    });

    expect(scope.loading).toBe(true);
    $httpBackend.flush();
    expect(scope.loading).toBe(false);

    expect(scope.alert).toHaveBeenCalled();

  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

});