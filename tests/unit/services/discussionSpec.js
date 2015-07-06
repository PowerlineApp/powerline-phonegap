describe('Discussion', function () {

  beforeEach(module('app.services'));

  var $httpBackend,
    url,
    testData = [
      {
        id: 1,
        parent_comment: 0,
        comment_body: '',
        created_at: 'Fri, 07 Jun 2013 09:00:00 +0100'
      },
      {
        id: 2,
        parent_comment: 1,
        comment_body: '',
        created_at: 'Fri, 07 Jun 2013 10:00:00 +0100'
      },
      {
        id: 3,
        parent_comment: 1,
        comment_body: '',
        created_at: 'Fri, 07 Jun 2013 10:01:00 +0100'
      },
      {
        id: 4,
        parent_comment: 1,
        comment_body: '',
        created_at: 'Fri, 07 Jun 2013 09:50:00 +0100'
      },
      {
        id: 5,
        parent_comment: 4,
        comment_body: '',
        created_at: 'Fri, 07 Jun 2013 09:55:00 +0100'
      }
    ]
    ;

  beforeEach(inject(function ($injector, serverConfig) {
    $httpBackend = $injector.get('$httpBackend');
    url = serverConfig.url;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should assign data to model', inject(function (Comment) {
    var dateStr = 'Fri, 07 Jun 2013 09:00:00 +0100';
    var comment = new Comment({id: 2, created_at: dateStr});
    expect(comment.id).toEqual(2);
    expect(comment.created_at).toEqual(dateStr);
    expect(comment.created_at_date).not.toBeUndefined();
    expect(comment.created_at_date.getTime).not.toBeUndefined();
  }));

  it('should set default user whene privacy 1', inject(function (Comment) {
    var comment = new Comment({privacy: 1});
    expect(comment.user).not.toBeUndefined();
    expect(comment.user.full_name).toEqual('Someone');
  }));

  it('should load comments from server by id and type', inject(function (discussion) {
    $httpBackend.expectGET(url + '/api/poll/3/comments/').respond(200, []);
    $httpBackend.expectGET(url + '/api/micro-petitions/2/comments/').respond(200, []);
    discussion.loadTree('poll', 3);
    discussion.loadTree('micro-petitions', 2);
    $httpBackend.flush(2);
  }));

  it('should build comment tree and sort by created date', inject(function (discussion) {
    $httpBackend.expectGET(url + '/api/poll/1/comments/').respond(200, _.clone(testData));

    var root, byId;
    discussion.loadTree('poll', 1).then(function (data) {
      root = data.root;
      byId = data.byId;
    });
    $httpBackend.flush();
    expect(root.id).toEqual(1);
    expect(root.children.length).toEqual(3);
    expect(root.children[0].id).toEqual(3);
    expect(root.children[0].children.length).toEqual(0);
    expect(root.children[2].children[0].id).toEqual(5);
    expect(root.children[1].children.length).toEqual(0);
    expect(byId[1]).toEqual(root);
    expect(byId[4]).toEqual(root.children[2]);

  }));

  it('should create new comment', inject(function (discussion) {
    $httpBackend.expectPOST(url + '/api/poll/1/comments/', '{"parent_comment":1,"comment_body":"test"}')
      .respond(200, {id: 2, parent_comment: 1, comment_body: 'test'});
    discussion.createComment('poll', 1, {parent_comment: 1, comment_body: 'test'});
    $httpBackend.flush();
  }));

  it('should contain count of comments', inject(function (discussion) {
    $httpBackend.expectGET(url + '/api/poll/1/comments/').respond(200, _.clone(testData));

    var root, byId;
    discussion.loadTree('poll', 1).then(function (data) {
      root = data.root;
      byId = data.byId;
    });
    $httpBackend.flush();
    expect(root.children_count).toEqual(4);
    expect(root.children[2].children_count).toEqual(1);
    expect(root.children[1].children_count).toEqual(0);
  }));

  it('should contain parent item', inject(function (discussion) {
    $httpBackend.expectGET(url + '/api/poll/1/comments/').respond(200, _.clone(testData));

    var root, byId;
    discussion.loadTree('poll', 1).then(function (data) {
      root = data.root;
      byId = data.byId;
    });
    $httpBackend.flush();
    expect(root.parent).toBeUndefined();
    expect(root.children[0].parent).toEqual(root);
    expect(root.children[2].children[0].parent).toEqual(root.children[2]);
  }));

  it('should up rate to comment', inject(function (discussion, Comment) {
    var comment = new Comment({id: 2, rate_status: 0});
    $httpBackend.expectPOST(url + '/api/poll/comments/rate/2/up').respond(200, {
      rate_sum: 10,
      rate_status: 1
    });

    expect(comment.rate_status).toEqual(0);
    expect(comment.rate_sum).not.toEqual(10);
    discussion.rate(comment, 'up');
    expect(comment.rate_status).toEqual(1);
    $httpBackend.flush();
    expect(comment.rate_status).toEqual(1);
    expect(comment.rate_sum).toEqual(10);
  }));

  it('should down rate to comment', inject(function (discussion, Comment) {
    var comment = new Comment({id: 1, rate_status: 0});
    $httpBackend.expectPOST(url + '/api/poll/comments/rate/1/down').respond(200, {
      rate_sum: 10,
      rate_status: -1
    });

    discussion.rate(comment, 'down');
    expect(comment.rate_status).toEqual(-1);
    expect(comment.rate_sum).not.toEqual(10);
    $httpBackend.flush();
    expect(comment.rate_status).toEqual(-1);
    expect(comment.rate_sum).toEqual(10);
  }));

  it('should delete rate to comment', inject(function (discussion, Comment) {
    var comment = new Comment({id: 1, rate_status: 0});
    $httpBackend.expectPOST(url + '/api/poll/comments/rate/1/delete').respond(200, {
      rate_sum: 10
    });

    discussion.rate(comment, 'delete');
    expect(comment.rate_status).toEqual(0);
    expect(comment.rate_sum).not.toEqual(10);
    $httpBackend.flush();
    expect(comment.rate_status).toEqual(0);
    expect(comment.rate_sum).toEqual(10);
  }));
});