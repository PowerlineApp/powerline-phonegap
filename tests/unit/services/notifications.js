describe('onNotificationGCM', function () {

  beforeEach(module('app.services'));

  beforeEach(function () {
    module(function ($provide) {
      $provide.value('notificationsData', {});
    });
  });

  it('should set device token when receive "registered" event', inject(function (onNotificationGCM, notificationsData) {

    expect(notificationsData.regId).toBeUndefined();

    onNotificationGCM({
      event: 'registered',
      regid: 'test'
    });
    expect(notificationsData.regId).toEqual('test');

  }));

  it('should call activity action when receive question message', inject(function (onNotificationGCM, notificationsData) {
    notificationsData.actions = {activity: function () {
    }};
    notificationsData.$apply = function () {
    };

    spyOn(notificationsData, '$apply');
    spyOn(notificationsData.actions, 'activity');
    onNotificationGCM({
      event: 'message',
      payload: {
        type: 'activity'
      }
    });

    expect(notificationsData.$apply).toHaveBeenCalled();
  }));

});

describe('Notifications service', function () {

  beforeEach(module('app.services'));

  var token;

  beforeEach(function () {
    token = null;
    module(function ($provide) {
      $provide.value('session', {getToken: function () {
        return token;
      }});
    });
  });

  var $httpBackend, url;

  beforeEach(inject(function ($injector, serverConfig) {
    $httpBackend = $injector.get('$httpBackend');
    url = serverConfig.url;
  }));

  it('should not send android device token to server when session token is empty', inject(function (notificationsData) {
    expect(notificationsData.regId).toBeUndefined();
    notificationsData.regId = 'test';
  }));

  it('should send android device token to server', inject(function (notificationsData) {
    $httpBackend.expectGET(url + '/api/endpoints/').respond(200, []);
    $httpBackend.expectPOST(url + '/api/endpoints/', '{"type":"android","token":"test"}').respond(201, {});
    token = 'test';
    notificationsData.$digest();
    notificationsData.regId = 'test';
    notificationsData.$digest();
    $httpBackend.flush(2);
  }));

  it('should send android device token to server when session token has changed', inject(function (notificationsData) {
    $httpBackend.expectGET(url + '/api/endpoints/').respond(200, []);
    $httpBackend.expectPOST(url + '/api/endpoints/', '{"type":"android","token":"test-session"}').respond(201, {});
    notificationsData.$digest();
    notificationsData.regId = 'test-session';
    notificationsData.$digest();
    token = 'test';
    notificationsData.$digest();
    $httpBackend.flush(2);
  }));

  it('should send ios device token to server', inject(function (notificationsData) {
    $httpBackend.expectGET(url + '/api/endpoints/').respond(200, []);
    $httpBackend.expectPOST(url + '/api/endpoints/', '{"type":"ios","token":"test"}').respond(201, {});
    token = 'test';
    notificationsData.$digest();
    notificationsData.registerIOS('test');
    $httpBackend.flush(2);
    notificationsData.$digest();
  }));

  it('it should not send device token if device has endpoint', inject(function (notificationsData) {
    $httpBackend.expectGET(url + '/api/endpoints/').respond(200, [
      {id: 1, token: 'test'}
    ]);
    token = 'test';
    notificationsData.$digest();
    notificationsData.regId = 'test';
    notificationsData.$digest();
    $httpBackend.flush();
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

});

describe('Notification data', function () {

  beforeEach(module('app.services'));

  var newActivities = [];

  beforeEach(function () {
    module(function ($provide) {
      newActivities = [];
      $provide.value('activity', {getNewActivities: function () {
        return newActivities;
      }});
      $provide.value('session', {getToken: function () {
        return null;
      }});
    });
  });

  it('should show badge number from new activities on ios', inject(function (notificationsData, session) {
    notificationsData.pushPlugin = {setApplicationIconBadgeNumber: function () {
    }};
    spyOn(notificationsData.pushPlugin, 'setApplicationIconBadgeNumber');
    newActivities = _.range(5);
    notificationsData.token = 'test';
    notificationsData.$digest();
    expect(notificationsData.pushPlugin.setApplicationIconBadgeNumber).toHaveBeenCalledWith(angular.noop, 5);
    newActivities = [];
    notificationsData.$digest();
    expect(notificationsData.pushPlugin.setApplicationIconBadgeNumber).toHaveBeenCalledWith(angular.noop, 0);
  }));

  it('should not show badge number when ios token not specified', inject(function (notificationsData) {
    notificationsData.pushPlugin = {setApplicationIconBadgeNumber: function () {
    }};
    spyOn(notificationsData.pushPlugin, 'setApplicationIconBadgeNumber');
    newActivities = _.range(5);
    notificationsData.$digest();
    expect(notificationsData.pushPlugin.setApplicationIconBadgeNumber).not.toHaveBeenCalled();
  }));
});