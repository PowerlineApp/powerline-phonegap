describe('$rootScope', function () {

  beforeEach(module('app.controllers'));

  it('should return active class', inject(function ($rootScope) {
    expect($rootScope.getActiveClass(1, 1)).toEqual('active');
    expect($rootScope.getActiveClass('test', 'test')).toEqual('active');
    var a = {id: 2};
    expect($rootScope.getActiveClass(a, a)).toEqual('active');
  }));

  it('should not return active class', inject(function ($rootScope) {
    expect($rootScope.getActiveClass(0, 1)).toEqual('');
    expect($rootScope.getActiveClass('test', 'test2')).toEqual('');
    var a = {id: 2};
    var b = {id: 3};
    expect($rootScope.getActiveClass(a, b)).toEqual('');
  }));

  describe('execApply', function () {
    it('should not execute $apply if digest has already started', inject(function ($rootScope) {
      var originalApply = $rootScope.$apply;
      $rootScope.$apply = jasmine.createSpy('$apply');
      originalApply.call($rootScope, function () {
        $rootScope.execApply();
      });
      expect($rootScope.$apply).not.toHaveBeenCalled();
    }));

    it('should execute $apply if digest has not already started', inject(function ($rootScope) {
      $rootScope.$apply = jasmine.createSpy('$apply');
      $rootScope.execApply();
      expect($rootScope.$apply).toHaveBeenCalled();
    }));
  });
});

describe('loaded', function () {

  beforeEach(module('app.controllers'));

  it('should create function to change loading property', inject(function (loaded) {
    var scope = {loading: true};
    var func = loaded(scope);
    expect(scope.loading).toBeTruthy();
    func();
    expect(scope.loading).toBeFalsy();
  }));

  it('should execute callback', inject(function (loaded) {
    var scope = {loading: true};
    var callback = jasmine.createSpy('callback');
    var func = loaded(scope, callback);
    func();
    expect(callback).toHaveBeenCalled();
  }));
});