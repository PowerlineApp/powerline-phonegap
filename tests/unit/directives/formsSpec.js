describe('iPlaceholder', function () {

  beforeEach(module('app.directives'));

  it('should add i-placeholder-active class by default select option', inject(function ($rootScope, $compile) {
    var element = $compile('<select ng-model="test" i-placeholder><option value="">Test</option></select>')($rootScope);
    $rootScope.$digest();
    expect(element.hasClass('i-placeholder-active')).toBeTruthy();
  }));

  it('should remove i-placeholder-active class from select element when model is not empty', inject(function ($rootScope, $compile) {
    $rootScope.items = ['test1', 'test2'];
    var element = $compile('<select ng-model="test" i-placeholder ng-options="item for item in items"><option value="">Test</option></select>')($rootScope);
    $rootScope.$digest();
    $rootScope.test = $rootScope.items[0];
    $rootScope.$digest();
    expect(element.hasClass('i-placeholder-active')).toBeFalsy();
  }));

  it('should not add class to select element when model is not empty', inject(function ($rootScope, $compile) {
    $rootScope.items = ['test1', 'test2'];
    $rootScope.test = $rootScope.items[0];
    var element = $compile('<select ng-model="test" i-placeholder ng-options="item for item in items"><option value="">Test</option></select>')($rootScope);
    $rootScope.$digest();
    expect(element.hasClass('i-placeholder-active')).toBeFalsy();
  }));

});

describe('iCapitalize', function () {

  beforeEach(module('app.directives'));

  it('should capitalize first letter', inject(function ($rootScope, $compile) {
    $rootScope.title = '';
    $compile('<form name="form"><input ng-model="title" name="title" i-capitalize /></form>')($rootScope);
    $rootScope.$apply();
    $rootScope.form.title.$setViewValue('a');
    $rootScope.$apply();
    expect($rootScope.title).toEqual('A');
  }));
});