describe('Questions service', function () {

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

  it('should load following answers and outside answers', inject(function (questions) {
    $httpBackend.expectGET(url + '/api/poll/question/1/answers/influence').respond(200, {answers: [
      {id: 1, user: {}}
    ]});
    $httpBackend.expectGET(url + '/api/poll/question/1/answers/influence/outside').respond(200, {answers: [
      {id: 2, user: {}}
    ]});

    var answers;
    questions.loadAnswers(1).then(function (result) {
      answers = result;
    });
    $httpBackend.flush(2);
    expect(answers.length).toEqual(2);
  }));

  it('should contain avatar path', inject(function (questions) {
    $httpBackend.expectGET(url + '/api/poll/question/1/answers/influence').respond(200, {answers: [
      {id: 1, user: {avatar_file_name: 'test'}}
    ]});
    $httpBackend.expectGET(url + '/api/poll/question/1/answers/influence/outside').respond(200, {answers: []});

    var answers;
    questions.loadAnswers(1).then(function (result) {
      answers = result;
    });
    $httpBackend.flush(2);
    expect(answers[0].user.avatar_file_name).toEqual('test');
  }));

  it('should contain default avatar for friend', inject(function (questions) {
    $httpBackend.expectGET(url + '/api/poll/question/1/answers/influence').respond(200, {answers: [
      {id: 1}
    ], avatar_friend_hidden: 'test'});
    $httpBackend.expectGET(url + '/api/poll/question/1/answers/influence/outside').respond(200, {answers: []});

    var answers;
    questions.loadAnswers(1).then(function (result) {
      answers = result;
    });
    $httpBackend.flush(2);
    expect(answers[0].user.avatar_file_name).toEqual('test');
  }));

  it('should contain default avatar for outside', inject(function (questions) {
    $httpBackend.expectGET(url + '/api/poll/question/1/answers/influence').respond(200, {answers: []});
    $httpBackend.expectGET(url + '/api/poll/question/1/answers/influence/outside').respond(200, {answers: [
      {id: 1}
    ], avatar_someone: 'test'});

    var answers;
    questions.loadAnswers(1).then(function (result) {
      answers = result;
    });
    $httpBackend.flush(2);
    expect(answers[0].user.avatar_file_name).toEqual('test');
  }));

  it('should save question in cache after load', inject(function (questions, questionCache) {
    $httpBackend.expectGET(url + '/api/poll/question/1').respond(200, {id: 1, published_at: 'Fri, 07 Jun 2013 09:50:00 +0100'});
    expect(questionCache.get(1)).toBeUndefined();
    questions.load(1);
    $httpBackend.flush();
    expect(questionCache.get(1).id).toEqual(1);
  }));

  it('should get option label by id', inject(function (questions) {
    $httpBackend.expectGET(url + '/api/poll/question/1').respond(200, {id: 1, options: [
      {id: 2, value: 'A'},
      {id: 3, value: 'B'}
    ]});
    var q;
    questions.load(1).then(function (question) {
      q = question;
    });
    $httpBackend.flush();
    expect(q.getOptionLabel(2)).toEqual('A');
    expect(q.getOptionLabel(3)).toEqual('B');
  }));

});