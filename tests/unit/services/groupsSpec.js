describe('Groups service', function () {

  beforeEach(module('app.services'));

  var $httpBackend, url;

  beforeEach(inject(function ($injector, serverConfig) {
    $httpBackend = $injector.get('$httpBackend');
    url = serverConfig.url;
    $httpBackend.whenGET(url + '/api/groups/user-groups/').respond(200, []);
    $httpBackend.whenGET(url + '/api/groups/popular').respond(200, []);
    $httpBackend.whenGET(url + '/api/groups/new').respond(200, []);
  }));

  it('should load groups', inject(function (groups) {
    $httpBackend.expectGET(url + '/api/groups\\').respond(200, [
      {
        id: 1,
        joined: 0,
        official_title: 'a',
        group_type: 0
      }
    ]);
    groups.load();
    expect(groups.getAll().length).toEqual(0);
    $httpBackend.flush();
    expect(groups.getAll().length).toEqual(1);

  }));

  it('should sort items by alphabet', inject(function (groups) {
    $httpBackend.whenGET(url + '/api/groups\\').respond(200, [
      {
        id: 1,
        official_title: 'C test',
        group_type: 0
      },
      {
        id: 2,
        official_title: 'd test',
        group_type: 0
      },
      {
        id: 3,
        official_title: 'A test',
        group_type: 0
      },
      {
        id: 4,
        official_title: 'a',
        group_type: 0
      }
    ]);

    groups.load();
    $httpBackend.flush();
    var items = groups.getAll();

    expect(items.length).toEqual(4);
    expect(items[0].id).toEqual(4);
    expect(items[1].id).toEqual(3);
    expect(items[2].id).toEqual(1);
    expect(items[3].id).toEqual(2);
  }));

  it('should not create lettersGroups array when joined status is 0', inject(function (groups) {
    $httpBackend.whenGET(url + '/api/groups\\').respond(200, [
      {
        id: 1,
        joined: 0,
        official_title: 'C test',
        group_type: 0
      }
    ]);

    groups.load();
    $httpBackend.flush();
    var items = groups.getLettersGroups();

    expect(items.length).toEqual(0);
  }));

  it('should not add to lettersGroups array when group type not common', inject(function (groups) {
    $httpBackend.whenGET(url + '/api/groups\\').respond(200, [
      {
        id: 1,
        joined: 1,
        official_title: 'C test',
        group_type: 1
      }
    ]);

    groups.load();
    $httpBackend.flush();
    var items = groups.getLettersGroups();

    expect(items.length).toEqual(0);
  }));

  it('should search groups by query', inject(function (groups) {
    $httpBackend.whenGET(url + '/api/groups\\').respond(200, [
      {
        id: 2,
        joined: 0,
        official_title: 'd test',
        group_type: 0
      },
      {
        id: 3,
        joined: 0,
        official_title: 'A test',
        group_type: 0
      },
      {
        id: 4,
        joined: 0,
        official_title: 'a',
        group_type: 0
      }
    ]);

    groups.load();
    $httpBackend.flush();

    expect(groups.search().length).toEqual(0);
    expect(groups.search('').length).toEqual(0);
    expect(groups.search(' ').length).toEqual(0);

    expect(groups.search('a').length).toEqual(2);
    expect(groups.search('A').length).toEqual(2);
    expect(groups.search('a ').length).toEqual(1);

    expect(groups.search('c').length).toEqual(0);

  }));

  it('should load group info', inject(function (groups) {
    $httpBackend.expectGET(url + '/api/groups/info/1').respond(200, {id: 1});
    expect(groups.get(1)).toBeUndefined();
    groups.loadInfo(1);
    expect(groups.get(1)).toBeUndefined();
    $httpBackend.flush();
    expect(groups.get(1).id).toEqual(1);
  }));

  it('should load groups activities', inject(function (groups) {
    $httpBackend.expectGET(url + '/api/groups/info/1').respond(200, {id: 1});

    groups.loadInfo(1);
    $httpBackend.flush();

    $httpBackend.expectGET(url + '/api/poll/question/group/1').respond(200, [
      {},
      {}
    ]);
    groups.loadActivities(1);
    expect(groups.get(1).activities).not.toBeUndefined();
    expect(groups.get(1).activities.length).toEqual(0);
    $httpBackend.flush();
    expect(groups.get(1).activities.length).toEqual(2);
  }));

  it('should create full address from base info', inject(function (groups) {
    $httpBackend.expectGET(url + '/api/groups/info/1').respond(200, {id: 1});
    groups.loadInfo(1);
    $httpBackend.flush();
    expect(groups.get(1).full_address).toEqual('');

    $httpBackend.expectGET(url + '/api/groups/info/1').respond(200, {
      id: 1,
      official_city: 'test city',
      official_state: 'test state'
    });
    groups.loadInfo(1);
    $httpBackend.flush();
    expect(groups.get(1).full_address).toEqual('test city, test state');

    $httpBackend.expectGET(url + '/api/groups/info/1').respond(200, {
      id: 1,
      official_address: 'test address'
    });
    groups.loadInfo(1);
    $httpBackend.flush();
    expect(groups.get(1).full_address).toEqual('test address');

    $httpBackend.expectGET(url + '/api/groups/info/1').respond(200, {
      id: 1,
      official_address: 'test address',
      official_city: 'test city',
      official_state: 'test state'
    });
    groups.loadInfo(1);
    $httpBackend.flush();
    expect(groups.get(1).full_address).toEqual('test address, test city, test state');

  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

});

describe('groupsInvites', function () {

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

  it('should load groups invites', inject(function (groupsInvites) {
    $httpBackend.expectGET(url + '/api/groups/invites').respond(200, [
      {
        id: 1,
        avatar_file_path: '',
        official_title: ''
      }
    ]);
    groupsInvites.load();
    $httpBackend.flush();
    expect(groupsInvites.get().length).toEqual(1);
  }));

  it('should approve group invite', inject(function (GroupsInvitesResource) {
    var invite = new GroupsInvitesResource({id: 2});
    $httpBackend.expectPOST(url + '/api/groups/invites/approve/2', {id: 2}).respond(200, null);
    invite.$approve();
    $httpBackend.flush();
  }));

  it('should reject group invite', inject(function (GroupsInvitesResource) {
    var invite = new GroupsInvitesResource({id: 2});
    $httpBackend.expectPOST(url + '/api/groups/invites/reject/2', {id: 2}).respond(200, null);
    invite.$reject();
    $httpBackend.flush();
  }));

  it('should check existing invites by id', inject(function (groupsInvites) {
    $httpBackend.expectGET(url + '/api/groups/invites').respond(200, [
      {
        id: 12
      }
    ]);
    groupsInvites.load();
    $httpBackend.flush();
    expect(groupsInvites.hasInvite(1)).toBeFalsy();
    expect(groupsInvites.hasInvite(12)).toBeTruthy();
  }));
});