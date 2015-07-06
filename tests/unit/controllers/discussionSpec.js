describe('Discussion controller', function () {

  beforeEach(module('app.controllers'));

  var $httpBackend, url;

  beforeEach(inject(function ($injector, serverConfig, $rootScope) {
    $httpBackend = $injector.get('$httpBackend');
    url = serverConfig.url;
    $rootScope.path = function () {
      return '/discussion/';
    };
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should load comments by type and id', inject(function ($controller, $rootScope) {
    $httpBackend.expectGET(url + '/api/poll/1/comments/').respond(200, []);
    var scope = $rootScope.$new();
    $controller('discussion', {
      $scope: scope,
      $routeParams: {
        id: '1',
        entity: 'poll'
      }
    });
    $httpBackend.flush();
    $httpBackend.expectGET(url + '/api/micro-petition/1/comments/').respond(200, []);
    scope = $rootScope.$new();
    $controller('discussion', {
      $scope: scope,
      $routeParams: {
        id: '1',
        entity: 'micro-petition'
      }
    });
    $httpBackend.flush();
  }));

  it('should save loaded data to cache', inject(function ($controller, $rootScope, $cacheFactory) {
    $httpBackend.expectGET(url + '/api/poll/1/comments/').respond(200, [
      {
        id: 10,
        parent_comment: 0,
        created_at: 'Fri, 07 Jun 2013 09:00:00 +0100',
        comment_body: ''
      }
    ]);
    var scope = $rootScope.$new();
    $controller('discussion', {
      $scope: scope,
      $routeParams: {id: '1', entity: 'poll'}
    });
    $httpBackend.flush();
    expect($cacheFactory.get('discussionController').get('1').root.id).toEqual(10);
  }));

  it('should not load data when comment is not root and comment exists in cache', inject(function ($controller, $rootScope, $cacheFactory) {
    var child = {
      id: 11,
      parent_comment: 10,
      comment_body: '',
      children: []
    };
    var root = {
      id: 10,
      parent_comment: 0,
      comment_body: '',
      children: [child]
    };

    $cacheFactory.get('discussionController').put(1, {
      root: root,
      byId: {
        10: root,
        11: child
      }
    });
    var scope = $rootScope.$new();
    $controller('discussion', {
      $scope: scope,
      $routeParams: {id: '1', entity: 'poll', comment: 11}
    });
    expect(scope.comment).toEqual(child);
  }));

  it('should load data when comment is root and comment exists in cache', inject(function ($controller, $rootScope, $cacheFactory) {
    $httpBackend.expectGET(url + '/api/poll/1/comments/').respond(200, []);
    var child = {
      id: 11,
      parent_comment: 10,
      comment_body: '',
      children: []
    };
    var root = {
      id: 10,
      parent_comment: 0,
      comment_body: '',
      children: [child]
    };

    $cacheFactory.get('discussionController').put(1, {
      root: root,
      byId: {
        10: root,
        11: child
      }
    });
    var scope = $rootScope.$new();
    $controller('discussion', {
      $scope: scope,
      $routeParams: {id: '1', entity: 'poll'}
    });
    expect(scope.comment).toEqual(root);
    $httpBackend.flush();
  }));

  it('should show loading state', inject(function ($controller, $rootScope, $cacheFactory) {
    $httpBackend.expectGET(url + '/api/poll/1/comments/').respond(200, []);
    var scope = $rootScope.$new();
    $controller('discussion', {
      $scope: scope,
      $routeParams: {id: '1', entity: 'poll'}
    });
    expect(scope.loading).toBeTruthy();
    $httpBackend.flush();
    expect(scope.loading).toBeFalsy();
    var child = {
      id: 11,
      parent_comment: 10,
      comment_body: '',
      children: []
    };
    var root = {
      id: 10,
      parent_comment: 0,
      comment_body: '',
      children: [child]
    };

    $cacheFactory.get('discussionController').put(1, {
      root: root,
      byId: {
        10: root,
        11: child
      }
    });
    scope = $rootScope.$new();
    $controller('discussion', {
      $scope: scope,
      $routeParams: {id: '1', comment: 11, entity: 'poll'}
    });
    expect(scope.loading).toBeFalsy();
  }));

  it('should return red or green class for negative and positive numbers', inject(function ($controller, $rootScope, $cacheFactory) {
    var child = {
      id: 11,
      parent_comment: 10,
      comment_body: '',
      children: []
    };
    var root = {
      id: 10,
      parent_comment: 0,
      comment_body: '',
      children: [child]
    };

    $cacheFactory.get('discussionController').put(1, {
      root: root,
      byId: {
        10: root,
        11: child
      }
    });
    var scope = $rootScope.$new();
    $controller('discussion', {
      $scope: scope,
      $routeParams: {id: '1', comment: 11, entity: 'poll'}
    });
    expect(scope.getRateClass(0)).toEqual('');
    expect(scope.getRateClass(-1)).toEqual('red');
    expect(scope.getRateClass(1)).toEqual('green');
  }));

});
