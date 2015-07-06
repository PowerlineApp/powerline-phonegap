describe('iOpenSystem', function () {

  beforeEach(module('app.directives'));

  it('should open http link in system browser', inject(function ($rootScope, $compile, $window) {
    $window.open = jasmine.createSpy('$window.open');
    $rootScope.link = 'http://example.com';
    var element = $compile('<p i-open-system="link"></p>')($rootScope);
    $rootScope.$digest();
    element.trigger('click');
    expect($window.open).toHaveBeenCalledWith('http://example.com', '_system');
  }));

  it('should open https link in system browser', inject(function ($rootScope, $compile, $window) {
    $window.open = jasmine.createSpy('$window.open');
    $rootScope.link = 'https://example.com';
    var element = $compile('<p i-open-system="link"></p>')($rootScope);
    $rootScope.$digest();
    element.trigger('click');
    expect($window.open).toHaveBeenCalledWith('https://example.com', '_system');
  }));

  it('should add protocol to link if needed', inject(function ($rootScope, $compile, $window) {
    $window.open = jasmine.createSpy('$window.open');
    $rootScope.link = 'example.com';
    var element = $compile('<p i-open-system="link"></p>')($rootScope);
    $rootScope.$digest();
    element.trigger('click');
    expect($window.open).toHaveBeenCalledWith('http://example.com', '_system');
  }));
});

describe('iOpenSystemLinks', function () {

  beforeEach(module('app.directives'));
  beforeEach(inject(function () {
    window.cordova = {exec: jasmine.createSpy('$window.cordova.exec')};
  }));

  it('should open links in system browser', inject(function ($rootScope, $compile, $window) {
    $window.open = jasmine.createSpy('$window.open');
    var element = $compile('<p i-open-system-links><a href="http://example.com"></a></p>')($rootScope);
    $rootScope.$digest();
    element.find('a').trigger('click');
    expect($window.cordova.exec)
      .toHaveBeenCalledWith(null, null, 'InAppBrowser', 'open', ['http://example.com', '_system']);
  }));
});

describe('iBindTaggable', function () {

  beforeEach(module('app.directives'));

  it('should set value', inject(function ($rootScope, $compile) {
    var element = $compile('<div i-bind-taggable="value"></div>')($rootScope);
    $rootScope.value = 'test';
    $rootScope.$digest();
    expect(element.html()).toEqual('<span class="ng-scope">test</span>');
    $rootScope.value = 'test changed';
    $rootScope.$digest();
    expect(element.html()).toEqual('<span class="ng-scope">test changed</span>');
  }));

  it('should encode html entities in value', inject(function ($rootScope, $compile) {
    var element = $compile('<div i-bind-taggable="value"></div>')($rootScope);
    $rootScope.value = '<div>test</div>';
    $rootScope.$digest();
    expect(element.html()).toEqual('<span class="ng-scope">&lt;div&gt;test&lt;/div&gt;</span>');
    $rootScope.value = 'test <a>changed</a>';
    $rootScope.$digest();
    expect(element.html()).toEqual('<span class="ng-scope">test &lt;a&gt;changed&lt;/a&gt;</span>');
  }));

  it('should wrap hash tags', inject(function ($rootScope, $compile) {
    var element = $compile('<div i-bind-taggable="value" i-tags="tags"></div>')($rootScope);
    $rootScope.value = 'test #data';
    $rootScope.tags = ['#data'];
    $rootScope.$digest();
    expect(element.html()).toEqual('<span class="ng-scope">test <hash-tag ng-click="openTag(\'#data\')">#data</hash-tag></span>');
    $rootScope.value = 'test <a>#changed</a>';
    $rootScope.tags = ['#changed'];
    $rootScope.$digest();
    expect(element.html()).toEqual('<span class="ng-scope">test &lt;a&gt;<hash-tag ng-click="openTag(\'#changed\')">#changed</hash-tag>&lt;/a&gt;</span>');
    $rootScope.value = '#test test #t.';
    $rootScope.tags = ['#t', '#test'];
    $rootScope.$digest();
    expect(element.html()).toEqual('<span class="ng-scope"><hash-tag ng-click="openTag(\'#test\')">#test</hash-tag> test <hash-tag ng-click="openTag(\'#t\')">#t</hash-tag>.</span>');
    $rootScope.value = '#T test #test.';
    $rootScope.tags = ['#test', '#T'];
    $rootScope.$digest();
    expect(element.html()).toEqual('<span class="ng-scope"><hash-tag ng-click="openTag(\'#T\')">#T</hash-tag> test <hash-tag ng-click="openTag(\'#test\')">#test</hash-tag>.</span>');
  }));
});