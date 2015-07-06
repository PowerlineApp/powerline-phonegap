describe('navigateTo', function () {

  beforeEach(module('app.services'));

  it('should navigate to influence profile', inject(function (navigateTo, $location) {
    navigateTo('influence-profile', 2);
    expect($location.path()).toEqual('/influence/profile/2');
  }));

  it('should navigate to root comment of discussions', inject(function (navigateTo, $location) {
    navigateTo('discussion', 2);
    expect($location.path()).toEqual('/discussion/2');
  }));

  it('should navigate to comment of discussions', inject(function (navigateTo, $location) {
    navigateTo('discussion', 2, 10);
    expect($location.path()).toEqual('/discussion/2/10');
  }));

  it('should navigate by path parts', inject(function (navigateTo, $location) {
    navigateTo('path', 'test', 10, 'last');
    expect($location.path()).toEqual('/test/10/last');
    navigateTo('path', 'test', 10, null);
    expect($location.path()).toEqual('/test/10');
    navigateTo('path', 'test', 0, null);
    expect($location.path()).toEqual('/test');
    navigateTo('path');
    expect($location.path()).toEqual('/');
  }));

  it('should navigate to representative profile by question', inject(function (navigateTo, $location) {
    navigateTo('owner-profile', {
      id: 2,
      type: 'representative',
      storage_id: 999
    });
    expect($location.path()).toEqual('/representative/2/999');
  }));

  it('should navigate to group profile by question', inject(function (navigateTo, $location) {
    navigateTo('owner-profile', {
      id: 2,
      type: 'group'
    });
    expect($location.path()).toEqual('/group/2');
  }));

  it('should navigate to user profile', inject(function (navigateTo, $location) {
    navigateTo('owner-profile', {
      id: 2,
      type: 'user'
    });
    expect($location.path()).toEqual('/influence/profile/2');
  }));

  it('should not navigate to influence profile when id not specified', inject(function (navigateTo, $location) {
    $location.path('/test');
    navigateTo('influence-profile', undefined);
    expect($location.path()).toEqual('/test');
  }));

  it('should navigate to join group with params for joining', inject(function (navigateTo, $location) {
    navigateTo('group-join', {id: 2, membership_control: 0});
    expect($location.path()).toEqual('/group/2/join/0/0');
    navigateTo('group-join', {id: 2, membership_control: 0, fill_fields_required: false});
    expect($location.path()).toEqual('/group/2/join/0/0');
    navigateTo('group-join', {id: 22, membership_control: 1, fill_fields_required: true});
    expect($location.path()).toEqual('/group/22/join/1/1');
  }));
});