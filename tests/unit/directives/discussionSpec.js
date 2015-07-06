describe('Discussions directive', function () {

  beforeEach(module('app.directives'));
  beforeEach(module('app.controllers'));

  var $httpBackend,
    url
    ;

  beforeEach(inject(function ($injector, serverConfig, $rootScope) {
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.whenGET('templates/question/discussion-widget.html').respond(200, '');
    url = serverConfig.url;
    $rootScope.path = function () {
      return '';
    };
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should create discussion controller with route params"', inject(function ($rootScope, $compile) {
    $httpBackend.expectGET(url + '/api/poll/2/comments/').respond(200, []);
    var scope = $rootScope.$new();
    $rootScope.id = '2';
    $compile('<discussions id="id" entity="\'poll\'"></discussions>')(scope);
    scope.$digest();
    $httpBackend.flush();
  }));
});