describe('Filter: createGoogleMapsLink', function () {

  beforeEach(module('app.filters'));

  it('should create google maps link by address', inject(function (createGoogleMapsLinkFilter) {
    expect(createGoogleMapsLinkFilter('Test address')).toMatch(/maps.google.com/);
  }));

  it('should encode address', inject(function (createGoogleMapsLinkFilter) {
    expect(createGoogleMapsLinkFilter('Test address')).toMatch(/Test%20address/);
  }));
});

describe('Filter: iJoin', function () {
  beforeEach(module('app.filters'));

  it('should join array with separator', inject(function (iJoinFilter) {
    expect(iJoinFilter(['test', 'test1'], '::')).toBe('test::test1');
  }));

  it('should remove empty items from array and join with separator', inject(function (iJoinFilter) {
    expect(iJoinFilter(['test', '', false, 'test1', ''], '::')).toBe('test::test1');
  }));

  it('should return empty string', inject(function (iJoinFilter) {
    expect(iJoinFilter([], '::')).toBe('');
    expect(iJoinFilter(false, '::')).toBe('');
  }));
});

describe('Filter: iTel', function () {
  beforeEach(module('app.filters'));

  it('should create tel string for open in system', inject(function (iTelFilter) {
    expect(iTelFilter('(29)777-777')).toBe('tel:29777777');
    expect(iTelFilter(1234567890)).toBe('tel:1234567890');
    expect(iTelFilter('+1234567890')).toBe('tel:1234567890');
    expect(iTelFilter()).toBe('tel:');
  }));
});

describe('Filter: replace', function () {
  beforeEach(module('app.filters'));

  it('should replace strings by pattern', inject(function (replaceFilter) {
    expect(replaceFilter('test test t', '\\s', '-', 'g')).toBe('test-test-t');
    expect(replaceFilter(undefined, '\\s', '-', 'g')).toBe('');
  }));
});