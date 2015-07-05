describe('Influence profile controller', function () {

  beforeEach(module('app.controllers'));

  var $httpBackend, url;

  beforeEach(inject(function ($injector, serverConfig) {
    $httpBackend = $injector.get('$httpBackend');
    url = serverConfig.url;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should load user profile', inject(function ($rootScope, $controller) {

    $httpBackend.expectGET(url + '/api/profile/info/2').respond(200, {id: 2});

    var scope = $rootScope.$new();
    $controller('influence.profile', {
      $scope: scope,
      $routeParams: {id: 2}
    });

    expect(scope.data).toBeUndefined();
    expect(scope.loading).toBe(true);

    $httpBackend.flush();

    expect(scope.data).toBeDefined();
    expect(scope.loading).toBe(false);
    expect(scope.data.id).toEqual(2);

  }));

});

describe('Influence tab controller', function () {

  beforeEach(module('app.controllers'));

  it('should switch view and return correct class', inject(function ($rootScope, $controller, influencesCD) {

    var influencesCDTest = _.clone(influencesCD);

    var scope = $rootScope.$new();
    $controller('influences.tabs', {
      $scope: scope,
      influencesCD: influencesCDTest
    });

    expect(influencesCDTest.view).toEqual(influencesCD.view);
    expect(scope.tabLinkClass(influencesCD.view)).toEqual('active');

    scope.switchView('test');

    expect(influencesCDTest.view).toEqual('test');
    expect(scope.tabLinkClass(influencesCD.view)).toEqual('');

  }));
});

describe('Influences search controller', function () {

  beforeEach(module('app.controllers'));

  var $httpBackend, url;

  beforeEach(inject(function ($injector, serverConfig) {
    $httpBackend = $injector.get('$httpBackend');
    url = serverConfig.url;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should has empty data', inject(function ($rootScope, $controller) {

    var scope = $rootScope.$new();
    $controller('influences.search', {
      $scope: scope
    });

    expect(scope.results.length).toEqual(0);
    expect(scope.data.query).toEqual('');

  }));

  it('should search user by scope query', inject(function ($rootScope, $controller) {
    var scope = $rootScope.$new();
    $controller('influences.search', {
      $scope: scope
    });

    scope.data.query = 'test';

    $httpBackend.expectGET(url + '/api/users/?unfollowing=1&q=test&page=1&max_count=25').respond(200, [
      {},
      {}
    ]);
    scope.search();
    expect(scope.results.length).toEqual(0);

    $httpBackend.flush();

    expect(scope.results.length).toEqual(2);

  }));

  it('should send data to follow influence', inject(function ($rootScope, $controller, InfluenceResource) {
    var scope = $rootScope.$new();
    $controller('influences.search', {
      $scope: scope
    });

    var influence = new InfluenceResource({id: 1});

    $httpBackend.expectPOST(url + '/api/profile/follow/follow/1', {id: 1}).respond(200, {});
    scope.follow(influence);
    $httpBackend.flush();

    influence = new InfluenceResource({id: 3});

    $httpBackend.expectPOST(url + '/api/profile/follow/follow/3', {id: 3}).respond(200, {});
    scope.follow(influence);
    $httpBackend.flush();

  }));
});
