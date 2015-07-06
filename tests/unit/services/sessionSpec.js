describe('Session service', function () {

  beforeEach(module('app.services'));

  it('should set token to http headers', inject(function (session, $rootScope, $http) {
    session.token = 'test';
    $rootScope.$apply();
    expect($http.defaults.headers.common.Token).toEqual('test');

    session.token = 'test1';
    expect($http.defaults.headers.common.Token).toEqual('test');
    $rootScope.$apply();
    expect($http.defaults.headers.common.Token).toEqual('test1');
  }));

});

describe('Session service', function () {

  beforeEach(module('app.services'));

  var $httpBackend, url;

  beforeEach(inject(function ($injector, serverConfig) {
    $httpBackend = $injector.get('$httpBackend');
    url = serverConfig.url;
  }));

  it('should save token to local storage when checked "keep me logged"', inject(function (session, iStorage) {

    iStorage.set('token', '');
    $httpBackend.expectPOST(url + '/api/secure/login').respond(200, {token: 'test token'});
    session.login({}, true);

    expect(iStorage.get('token')).not.toEqual('test token');
    $httpBackend.flush();
    expect(iStorage.get('token')).toEqual('test token');
    expect(session.token).toEqual('test token');
  }));

  it('should execute success callback', inject(function (session) {
    var success = jasmine.createSpy('success');
    var error = jasmine.createSpy('error');

    $httpBackend.expectPOST(url + '/api/secure/login').respond(200, {token: 'test token'});
    session.login({}).then(success, error);
    $httpBackend.flush();

    expect(error).not.toHaveBeenCalled();
    expect(success).toHaveBeenCalled();
  }));

  it('should execute error callback', inject(function (session) {
    var success = jasmine.createSpy('success');
    var error = jasmine.createSpy('error');

    $httpBackend.expectPOST(url + '/api/secure/login').respond(400, {token: 'test token'});
    session.login({}).then(success, error);
    $httpBackend.flush();

    expect(error).toHaveBeenCalled();
    expect(success).not.toHaveBeenCalled();
  }));

  it('should save user id to local storage when checked "keep me logged', inject(function (session, iStorage) {
    iStorage.set('user_id', '');
    $httpBackend.expectPOST(url + '/api/secure/login').respond(200, {token: 'test', id: 23});
    session.login({}, true);

    expect(iStorage.get('user_id')).not.toEqual(23);
    $httpBackend.flush();
    expect(iStorage.get('user_id')).toEqual(23);
    expect(session.user_id).toEqual(23);
  }));
});
