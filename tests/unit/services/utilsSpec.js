describe('Youtube service', function () {

  beforeEach(module('app.services'));

  it('should parse video id from url', inject(function (youtube) {
    expect(youtube.parseId('http://www.youtube.com/watch?v=ON2XWvyePH8')).toEqual('ON2XWvyePH8');
    expect(youtube.parseId('http://www.youtube.com/watch?v=ON2XWvyePH8&')).toEqual('ON2XWvyePH8');
    expect(youtube.parseId('http://www.youtube.com/watch?v=ON2XWvyePH8 ')).toEqual('ON2XWvyePH8');
    expect(youtube.parseId('http://www.youtube.com/watch?t=test&v=ON2XWvyePH8')).toEqual('ON2XWvyePH8');
  }));

  it('should return null when video id not found', inject(function (youtube) {
    expect(youtube.parseId('http://www.youtube.com/watch?k=')).toBeNull();
  }));

  it('should generate default preview link', inject(function (youtube) {
    expect(youtube.generatePreviewLink('test')).toEqual('http://img.youtube.com/vi/test/0.jpg');
  }));

  it('should generate preview link with preview image id', inject(function (youtube) {
    expect(youtube.generatePreviewLink('test', 3)).toEqual('http://img.youtube.com/vi/test/3.jpg');
  }));

  it('shouldn\'t generate preview link when id is not defined', inject(function (youtube) {
    expect(youtube.generatePreviewLink()).toBeNull();
  }));

});

describe('errorFormMessage service', function () {

  beforeEach(module('app.services'));

  it('should return array with default error', inject(function (errorFormMessage, defaultsFormErrors) {
    expect(errorFormMessage({}).length).toEqual(1);
    expect(errorFormMessage({})[0]).toEqual(defaultsFormErrors.defaultError);
  }));

  it('should return required error', inject(function (errorFormMessage, defaultsFormErrors) {
    expect(errorFormMessage({
      $error: {required: []}
    })[0]).toEqual(defaultsFormErrors.required);
  }));

  it('should replace error message', inject(function (errorFormMessage) {
    expect(errorFormMessage({
      $error: {required: []}
    }, {
      required: 'Replaced error message.'
    })[0]).toEqual('Replaced error message.');
  }));

  it('should add default error message for unknown error type', inject(function (errorFormMessage, defaultsFormErrors) {
    var error = errorFormMessage({
      $error: {unknown_error_type: []}
    });

    expect(error.length).toEqual(1);
    expect(error[0]).toEqual(defaultsFormErrors.defaultError);

  }));

  it('should return correct errors count', inject(function (errorFormMessage) {
    expect(errorFormMessage({
      $error: {
        required: [],
        email: [],
        url: false,
        repeated: false
      }
    }).length).toEqual(2);
  }));
});

describe('getFormData', function () {

  beforeEach(module('app.services'));

  it('should return form data as hash', inject(function ($compile, $rootScope, getFormData) {
    var doc = $compile('<form>')($rootScope);
    expect(getFormData(doc.data('$formController'))).toEqual(jasmine.any(Object));
  }));

  it('should contain form data in hash object', inject(function ($compile, $rootScope, getFormData) {
    var scope = $rootScope.$new(true);
    scope.username = 'test';
    var doc = $compile('<form><input type="text" name="username" ng-model="username"></form>')(scope);
    scope.$digest();
    expect(getFormData(doc.data('$formController')).username).toEqual('test');
  }));

  it('should clone value if it is object', inject(function ($compile, $rootScope, getFormData) {
    var scope = $rootScope.$new(true);
    scope.item = {id: 2, name: 'test2'};
    scope.items = [
      {id: 1, name: 'test1'},
      {id: 2, name: 'test2'}
    ];
    var doc = $compile('<form><select name="item" ng-model="item" ng-options="c.name for c in items"></select></form>')(scope);
    scope.$digest();
    expect(doc.data('$formController').item.$modelValue).toBe(scope.item);
    var data = getFormData(doc.data('$formController'));
    expect(data.item).not.toBe(scope.item);
    expect(data.item.name).toEqual('test2');
    expect(data.item.id).toEqual(2);
  }));

  it('should change property name from transformers object', inject(function ($compile, $rootScope, getFormData) {
    var scope = $rootScope.$new(true);
    scope.item1 = 'test1';
    scope.item2 = 'test2';
    var doc = $compile('<form><input type="text" name="item1" ng-model="item1"><input type="text" name="item2" ng-model="item2"></form>')(scope);
    scope.$digest();
    var data = getFormData(doc.data('$formController'), {item1: 'item1_changed'});
    expect(data.item1).toBeUndefined();
    expect(data.item2).toEqual('test2');
    expect(data.item1_changed).toEqual('test1');
  }));

  it('should change value from transformer', inject(function ($compile, $rootScope, getFormData) {
    var scope = $rootScope.$new(true);
    scope.item1 = 'test1';
    scope.item2 = 'test2';
    var doc = $compile('<form><input type="text" name="item1" ng-model="item1"><input type="text" name="item2" ng-model="item2"></form>')(scope);
    scope.$digest();
    var data = getFormData(doc.data('$formController'), {
      item1: function (value) {
        return value + '_changed';
      }
    });
    expect(data.item1).toEqual('test1_changed');
    expect(data.item2).toEqual('test2');
  }));

  it('should change value and property name from transformer', inject(function ($compile, $rootScope, getFormData) {
    var scope = $rootScope.$new(true);
    scope.item1 = 'test1';
    scope.item2 = 'test2';
    var doc = $compile('<form><input type="text" name="item1" ng-model="item1"><input type="text" name="item2" ng-model="item2"></form>')(scope);
    scope.$digest();
    var data = getFormData(doc.data('$formController'), {
      item1: ['item1_changed', function (value) {
        return value + '_changed';
      }]
    });
    expect(data.item1).toBeUndefined();
    expect(data.item1_changed).toEqual('test1_changed');
    expect(data.item2).toEqual('test2');
  }));
});

describe('camelcase2underscore', function () {

  beforeEach(module('app.services'));

  it('should transform camelcase into underscore', inject(function (camelcase2underscore) {
    expect(camelcase2underscore('testUnderscore')).toBe('test_underscore');
  }));
});

describe('iParse', function () {

  beforeEach(module('app.services'));

  it('should return time string from full date string', inject(function (iParse) {
    expect(iParse.getTimeString('28.10.2013 9:00:54')).toBe('9:00');
    expect(iParse.getTimeString('2013-12-07 9:00:54')).toBe('9:00');
    expect(iParse.getTimeString('28.10.2013 19:00:54')).toBe('19:00');
    expect(iParse.getTimeString('2013-12-07 19:00:54')).toBe('19:00');
    expect(iParse.getTimeString('12/07/2013 9:00:54')).toBe('9:00');
    expect(iParse.getTimeString('12/07/2013 19:00:54')).toBe('19:00');
  }));

  it('should wrap hash tags', inject(function(iParse) {
    expect(iParse.wrapHashTags(' #powerline '))
      .toEqual(' <hash-tag>#powerline</hash-tag> ');
    expect(iParse.wrapHashTags('https://powerline.ne#login'))
      .toEqual('https://powerline.ne#login');
    expect(iParse.wrapHashTags('#powerline!'))
      .toEqual('<hash-tag>#powerline</hash-tag>!');
  }));

  it('should wrap links', inject(function(iParse) {
    expect(iParse.wrapLinks('website https://powerli.ne.'))
      .toEqual('website <a href="https://powerli.ne" target="_blank">powerli.ne</a>.');
  }));
});