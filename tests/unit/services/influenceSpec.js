describe('Influence service', function () {

  beforeEach(module('app.services'));

  var $httpBackend, url;

  beforeEach(inject(function ($injector, serverConfig, influenceData) {
    $httpBackend = $injector.get('$httpBackend');
    url = serverConfig.url;
    influenceData.following = [];
    influenceData.followers = [];
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should load user info', inject(function (influence) {
    $httpBackend.expectGET(url + '/api/profile/info/1').respond(200, {id: 1});
    influence.loadInfluence(1);
    expect(influence.get(1)).toBeUndefined();
    $httpBackend.flush();
    expect(influence.get(1)).not.toBeUndefined();
  }));

  it('should search users by query', inject(function (influence) {
    $httpBackend.expectGET(url + '/api/users/?unfollowing=1&q=test&page=3&max_count=5').respond(200, [
      {id: 1}
    ]);
    var data = [];
    influence.search('test', 3, 5).then(function (results) {
      data = results;
    });
    expect(data.length).toEqual(0);
    $httpBackend.flush();
    expect(data.length).toEqual(1);
  }));

  it('should load user followers', inject(function (influence) {
    $httpBackend.expectGET(url + '/api/profile/followers').respond(200, [
      {follower: {id: 2}}
    ]);
    influence.loadFollowers();
    expect(influence.getFollowers().length).toEqual(0);
    $httpBackend.flush();
    expect(influence.getFollowers().length).toEqual(1);
  }));

  it('should load user following', inject(function (influence) {
    $httpBackend.expectGET(url + '/api/profile/following').respond(200, [
      {user: {id: 2}}
    ]);
    influence.loadFollowing();
    expect(influence.getFollowing().length).toEqual(0);
    $httpBackend.flush();
    expect(influence.getFollowing().length).toEqual(1);
  }));

  it('should contain id property from follower object', inject(function (influence) {
    $httpBackend.expectGET(url + '/api/profile/followers').respond(200, [
      {follower: {id: 2}}
    ]);
    influence.loadFollowers();
    $httpBackend.flush();
    expect(influence.getFollowers()[0].id).toEqual(2);
  }));

  it('should contain id property from user object', inject(function (influence) {
    $httpBackend.expectGET(url + '/api/profile/following').respond(200, [
      {user: {id: 2}}
    ]);
    influence.loadFollowing();
    $httpBackend.flush();
    expect(influence.getFollowing()[0].id).toEqual(2);
  }));

  it('should load waiting for approve followers', inject(function (influence) {
    $httpBackend.expectGET(url + '/api/profile/waiting-followers').respond(200, [
      {follower: {id: 2}}
    ]);
    influence.loadWaitingApproveFollowers();
    expect(influence.getWaitingApproveFollowers().length).toEqual(0);
    $httpBackend.flush();
    expect(influence.getWaitingApproveFollowers().length).toEqual(1);
    expect(influence.getWaitingApproveFollowers()[0].id).toEqual(2);
  }));
});
