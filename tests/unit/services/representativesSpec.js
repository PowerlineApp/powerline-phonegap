describe('Representatives service', function () {
  beforeEach(module('app.services'));

  var $httpBackend, url;

  beforeEach(inject(function ($injector, serverConfig) {
    $httpBackend = $injector.get('$httpBackend');
    url = serverConfig.url;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should load representatives groups', inject(function (representatives) {
    $httpBackend.expectGET(url + '/api/representatives\\').respond(200, [
      {}
    ]);
    representatives.load();
    expect(representatives.getRepresentativesGroups().length).toEqual(0);
    $httpBackend.flush();
    expect(representatives.getRepresentativesGroups().length).toEqual(1);
  }));

  it('should load representative info by representative id', inject(function (representatives) {
    $httpBackend.expectGET(url + '/api/representatives/info/1/0').respond(200, {id: 1});
    $httpBackend.expectGET(url + '/api/poll/question/representative/1').respond(200, []);
    representatives.loadInfo(1, 0);
    expect(representatives.get(1, 0)).toBeUndefined();
    $httpBackend.flush();
    expect(representatives.get(1, 0).id).toEqual(1);
  }));

  it('should load representative info by storage id', inject(function (representatives) {
    $httpBackend.expectGET(url + '/api/representatives/info/0/1').respond(200, {id: 1});
    representatives.loadInfo(0, 1);
    expect(representatives.get(0, 1)).toBeUndefined();
    $httpBackend.flush();
    expect(representatives.get(0, 1).id).toEqual(1);
  }));

  it('should update representative info', inject(function (representatives) {
    $httpBackend.whenGET(url + '/api/representatives/info/1/0').respond(200, {id: 1});
    $httpBackend.expectGET(url + '/api/poll/question/representative/1').respond(200, []);
    representatives.loadInfo(1, 0);
    $httpBackend.flush();
    $httpBackend.expectGET(url + '/api/poll/question/representative/1').respond(200, []);
    representatives.updateInfo(1);
    $httpBackend.flush();
  }));

  it('should replace data form representative property', inject(function (representatives) {
    $httpBackend.expectGET(url + '/api/representatives\\').respond(200, [
      {
        representatives: [
          {
            storage_id: 22
          },
          {
            representative: {
              id: 2,
              first_name: 'first name',
              last_name: 'last name',
              official_title: 'official title',
              avatar_file_path: 'test'
            }
          }
        ]
      }
    ]);
    representatives.load();
    $httpBackend.flush();
    expect(representatives.getRepresentativesGroups()[0].representatives[0].storage_id).toEqual(22);
    expect(representatives.getRepresentativesGroups()[0].representatives[1].storage_id).toEqual(0);
    expect(representatives.getRepresentativesGroups()[0].representatives[1].first_name).toEqual('first name');
    expect(representatives.getRepresentativesGroups()[0].representatives[1].last_name).toEqual('last name');
    expect(representatives.getRepresentativesGroups()[0].representatives[1].official_title).toEqual('official title');
    expect(representatives.getRepresentativesGroups()[0].representatives[1].avatar_file_path).toEqual('test');
  }));

});