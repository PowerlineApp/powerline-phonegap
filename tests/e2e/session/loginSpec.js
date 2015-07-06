describe('Login screen:', function () {

  beforeEach(function () {
    browser().navigateTo('/www/index.html');
  });

  it('should navigate to login screen', function () {
    expect(browser().location().path()).toBe('/login');
  });

  describe('Login form', function () {
    it('should contain login form', function () {
      expect(element('.login-form').count()).toBe(1);
    });

    it('should redirect to home screen after login', function () {
      input('data.username').enter('mobile1');
      input('data.password').enter('mobile1');
      element('.login-form .red-btn a').click();
    });
  });


});
