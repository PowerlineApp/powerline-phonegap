describe('Question controller', function () {

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

  it('should load question', inject(function ($controller, $rootScope) {
    $httpBackend.expectGET(url + '/api/poll/question/1').respond(200, {});
    var scope = $rootScope.$new();
    $controller('question', {
      $scope: scope,
      $routeParams: {id: '1'}
    });
    expect(scope.loading).toBeTruthy();
    $httpBackend.flush();
    expect(scope.loading).toBeFalsy();
  }));
});

describe('Question influences controller', function () {

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

  it('should load question answers', inject(function ($controller, $rootScope) {
    $httpBackend.expectGET(url + '/api/poll/question/2/answers/influence').respond(200, {answers: []});
    $httpBackend.expectGET(url + '/api/poll/question/2/answers/influence/outside').respond(200, {answers: [
      {id: 1}
    ], avatar_someone: 'test'});
    var scope = $rootScope.$new();
    $controller('question.influences', {
      $scope: scope,
      $routeParams: {id: '2'}
    });
    expect(scope.answers).toBeUndefined();
    $httpBackend.flush(2);
    expect(scope.answers).toBeDefined();
    expect(scope.answers.length).toEqual(1);
  }));
});

describe('Question news controller', function () {

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

  it('should load question', inject(function ($controller, $rootScope) {
    $httpBackend.expectGET(url + '/api/poll/question/1').respond(200, {});
    var scope = $rootScope.$new();
    $controller('question.news', {
      $scope: scope,
      $routeParams: {id: '1'}
    });
    expect(scope.loading).toBeTruthy();
    $httpBackend.flush();
    expect(scope.loading).toBeFalsy();
  }));
});