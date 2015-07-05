describe('iRadioListClass', function () {

  beforeEach(module('app.directives'));

  it('should move (switch) class between list items', inject(function ($rootScope, $compile) {
    var element = $compile('<ul i-radio-list-class="\'test-class\'"><li i-radio-list-item></li><li i-radio-list-item></li></ul>')($rootScope);
    $rootScope.$digest();

    element.find('li:first-child').trigger('click');

    expect(element.find('li.test-class:first-child').length).toEqual(1);
    expect(element.find('li.test-class').length).toEqual(1);

    element.find('li:last-child').trigger('click');

    expect(element.find('li.test-class:last-child').length).toEqual(1);
    expect(element.find('li.test-class').length).toEqual(1);

  }));

  it('should toggle class', inject(function ($rootScope, $compile) {
    var element = $compile('<ul i-radio-list-class="\'test-class\'"><li i-radio-list-item></li><li i-radio-list-item></li></ul>')($rootScope);
    $rootScope.$digest();

    element.find('li:first-child').trigger('click');

    expect(element.find('li.test-class:first-child').length).toEqual(1);
    expect(element.find('li.test-class').length).toEqual(1);

    element.find('li:first-child').trigger('click');

    expect(element.find('li.test-class').length).toEqual(0);

  }));

  it('should not toggle class when item has not attribute "i-radio-list-item"', inject(function ($rootScope, $compile) {
    var element = $compile('<ul i-radio-list-class="\'test-class\'"><li></li><li></li></ul>')($rootScope);
    $rootScope.$digest();

    element.find('li:first-child').trigger('click');
    expect(element.find('li.test-class').length).toEqual(0);

  }));

});

describe('iPagination', function () {

  beforeEach(module('app.directives'));

  it('should return first page items in directive scope and use 10 as default page count', inject(function ($rootScope, $compile) {
    var scope = $rootScope.$new();
    scope.items = _.range(20);
    var element = $compile('<div i-pagination="items"><p ng-repeat="item in pagination">{{ item }}</p></div>')(scope);
    scope.$digest();
    expect(element.find('p').length).toEqual(10);
    expect(element.find('p:first-child').text()).toEqual('0');
  }));

  it('should update pagination on change items', inject(function ($rootScope, $compile) {
    var scope = $rootScope.$new();
    scope.items = ['test'];
    var element = $compile('<div i-pagination="items"><p ng-repeat="item in pagination">{{ item }}</p></div>')(scope);
    scope.$digest();
    expect(element.find('p').length).toEqual(1);
    expect(element.find('p:first-child').text()).toEqual('test');

    scope.items = ['new_value', 'new_next_value'];
    scope.$digest();
    expect(element.find('p').length).toEqual(2);
    expect(element.find('p:first-child').text()).toEqual('new_value');
  }));

  it('should create new scope for its properties', inject(function ($rootScope, $compile) {
    var scope = $rootScope.$new();
    scope.items = _.range(20);
    $compile('<div i-pagination="items"><p ng-repeat="item in pagination">{{ item }}</p></div>')(scope);
    expect(scope.pagination).toBeUndefined();
    expect(scope.hasNext).toBeUndefined();
    expect(scope.hasPrev).toBeUndefined();
  }));

  it('should add hasNext and hasPrev to scope', inject(function ($rootScope, $compile) {
    var scope = $rootScope.$new();
    scope.items = _.range(20);
    var element = $compile('<div i-pagination="items"></div>')(scope);
    scope.$digest();
    expect(element.scope().hasNext()).toBeTruthy();
    expect(element.scope().hasPrev()).toBeFalsy();

    scope.items = _.range(10);
    scope.$digest();
    expect(element.scope().hasNext()).toBeFalsy();
    expect(element.scope().hasPrev()).toBeFalsy();
  }));

  it('should show next page', inject(function ($rootScope, $compile) {
    var scope = $rootScope.$new();
    scope.items = _.range(20);
    var element = $compile('<div i-pagination="items"><p ng-repeat="item in pagination">{{ item }}</p></div>')(scope);
    scope.$digest();
    element.scope().next();
    scope.$digest();
    expect(element.find('p').length).toEqual(10);
    expect(element.find('p:first-child').text()).toEqual('10');
    expect(element.scope().hasNext()).toBeFalsy();
    expect(element.scope().hasPrev()).toBeTruthy();
  }));

  it('should show previous page', inject(function ($rootScope, $compile) {
    var scope = $rootScope.$new();
    scope.items = _.range(20);
    var element = $compile('<div i-pagination="items"><p ng-repeat="item in pagination">{{ item }}</p></div>')(scope);
    scope.$digest();
    element.scope().next();
    scope.$digest();
    element.scope().prev();
    scope.$digest();
    expect(element.find('p').length).toEqual(10);
    expect(element.find('p:first-child').text()).toEqual('0');
    expect(element.scope().hasNext()).toBeTruthy();
    expect(element.scope().hasPrev()).toBeFalsy();
  }));

  it('should not show prev or next when hasPrev() and hasNext() is false', inject(function ($rootScope, $compile) {
    var scope = $rootScope.$new();
    scope.items = _.range(10);
    var element = $compile('<div i-pagination="items"><p ng-repeat="item in pagination">{{ item }}</p></div>')(scope);
    scope.$digest();
    expect(element.scope().hasNext()).toBeFalsy();
    expect(element.scope().hasPrev()).toBeFalsy();
    expect(element.find('p').length).toEqual(10);
    element.scope().next();
    scope.$digest();
    expect(element.find('p').length).toEqual(10);
    element.scope().prev();
    element.scope().prev();
    scope.$digest();
    expect(element.find('p').length).toEqual(10);
  }));
});
