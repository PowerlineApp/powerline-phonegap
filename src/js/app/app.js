angular.module('app', [
  'app.config',
  'app.controllers',
  'app.directives',
  'app.filters',
  'app.services',
  'ngTouch',
  'ngSanitize',
  'ngAnimate',
  'JsCollection',
  'pasvaz.bindonce',
  'google-maps'.ns(),
  'angular-cache'
]).config(function ($routeProvider, $locationProvider, $httpProvider) {

  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  $httpProvider.responseInterceptors.push('authInterceptor');

  $locationProvider.html5Mode(false);


  $routeProvider
    .when('/', {
      templateUrl: 'templates/home/preload.html',
      controller: 'preload'
    })
    .when('/main', {
      templateUrl: 'templates/home/home.html',
      controller: 'home'
    })
    .when('/new-activities', {
      templateUrl: 'templates/home/home.html',
      controller: 'home'
    })
    .when('/login', {
      templateUrl: 'templates/session/login.html',
      controller: 'session.login'
    })
    .when('/logout', {
      templateUrl: 'templates/session/logout.html',
      controller: 'session.logout'
    })
    .when('/coming-soon', {
      templateUrl: 'templates/coming-soon.html'
    })
    .when('/terms', {
      templateUrl: 'templates/terms.html',
      controller: 'session.terms'
    })
    .when('/registration', {
      templateUrl: 'templates/session/registration.html',
      controller: 'session.registration'
    })
    .when('/registration-step2', {
      templateUrl: 'templates/session/registration-step2.html',
      controller: 'session.registration-step2'
    })
    .when('/registration-step3', {
      templateUrl: 'templates/session/registration-step3.html',
      controller: 'session.registration-step3'
    })
    .when('/questions/:id', {
      templateUrl: 'templates/question/layout.html',
      controller: 'question'
    })
    .when('/questions/news/:id', {
      templateUrl: 'templates/question/news.html',
      controller: 'question.news'
    })
    .when('/question/leader-petition/:id', {
      templateUrl: 'templates/question/petition.html',
      controller: 'question.leader-petition'
    })
    .when('/questions/educational/:id', {
      templateUrl: 'templates/question/educational-context.html',
      controller: 'question.educational-context'
    })
    .when('/questions/influences/:id', {
      templateUrl: 'templates/question/influences.html',
      controller: 'question.influences'
    })
    .when('/forgot-password', {
      templateUrl: 'templates/session/forgot-password.html',
      controller: 'session.forgot-password'
    })
    .when('/town', {
      templateUrl: 'templates/coming-soon.html'
    })
    .when('/groups', {
      controller: 'groups',
      templateUrl: 'templates/groups/my-groups.html'
    })
    .when('/groups/search', {
      controller: 'groups.search',
      templateUrl: 'templates/groups/search.html'
    })
    .when('/groups/create', {
      controller: 'groups.create',
      templateUrl: 'templates/groups/create.html'
    })
    .when('/group/:id', {
      controller: 'groups.profile',
      templateUrl: 'templates/groups/profile.html'
    })
    .when('/group/:id/join/:publicStatus/:isFieldRequired', {
      controller: 'groups.join',
      templateUrl: 'templates/groups/join.html'
    })
    .when('/messages', {
      controller: 'messages',
      templateUrl: 'templates/messages/list.html'
    })
    .when('/influences', {
      controller: 'influences',
      templateUrl: 'templates/influence/influences.html'
    })
    .when('/influences/add', {
      controller: 'influences.search',
      templateUrl: 'templates/influence/search.html'
    })
    .when('/influences/notifications', {
      controller: 'influences.notifications',
      templateUrl: 'templates/influence/notifications.html'
    })
    .when('/representatives', {
      controller: 'representatives',
      templateUrl: 'templates/representatives/list.html'
    })
    .when('/representative/:id/:storageId', {
      controller: 'representatives.profile',
      templateUrl: 'templates/representatives/profile.html'
    })
    .when('/group-petitions', {
      controller: 'home',
      templateUrl: 'templates/home/home.html'
    })
    .when('/micro-petitions/add/:type/', {
      controller: 'petitions.add',
      templateUrl: 'templates/petitions/add.html'
    })
    .when('/micro-petitions/add/:type/:group_id', {
      controller: 'petitions.add',
      templateUrl: 'templates/petitions/add.html'
    })
    .when('/group-petitions/:id', {
      controller: 'petitions.group',
      templateUrl: 'templates/petitions/group.html'
    })
    .when('/petition/:id', {
      controller: 'petition',
      templateUrl: 'templates/petitions/petition.html'
    })
    .when('/payment-polls/payment-request/:id', {
      controller: 'question.payment-request',
      templateUrl: 'templates/payment-polls/payment-request.html'
    })
    .when('/payment-polls/crowdfunding-payment-request/:id', {
      controller: 'question.payment-request',
      templateUrl: 'templates/payment-polls/crowdfunding-payment-request.html'
    })
    .when('/leader-event/:id', {
      controller: 'question.leader-event',
      templateUrl: 'templates/leader-event/leader-event.html'
    })
    .when('/poling', {
      templateUrl: 'templates/coming-soon.html'
    })
    .when('/other-services', {
      controller: 'services',
      templateUrl: 'templates/services/index.html'
    })
    .when('/profile', {
      templateUrl: 'templates/profile/profile.html',
      controller: 'profile'
    })
    .when('/profile-2', {
      templateUrl: 'templates/profile/profile-2.html',
      controller: 'profile-step2'
    })
    .when('/profile-3', {
      templateUrl: 'templates/profile/profile-3.html',
      controller: 'profile-step3'
    })
    .when('/settings', {
      templateUrl: 'templates/profile/settings.html',
      controller: 'settings'
    })
    .when('/influence/profile/:id', {
      templateUrl: 'templates/influence/profile.html',
      controller: 'influence.profile'
    })
    .when('/discussion/:entity/:id', {
      templateUrl: 'templates/question/discussion.html',
      controller: 'discussion'
    })
    .when('/discussion/:entity/:id/:comment', {
      templateUrl: 'templates/question/discussion.html',
      controller: 'discussion'
    })
    .when('/search', {
      templateUrl: 'templates/search/index.html',
      controller: 'search'
    })
    .when('/guide', {
      templateUrl: 'templates/guide/index.html',
      controller: 'guide'
    })
    .when('/guide-confirm', {
      templateUrl: 'templates/guide/confirm.html',
      controller: 'guide.confirm'
    })
  ;

}).run(function (session, $location, layout, $document, $rootScope, $window, iStorageMemory, profile) {

  var $body = $document.find('body');
  $document.bind('scroll', function () {
    if ($document.height() <= $document.scrollTop() + $body.height()) {
      $rootScope.$broadcast('scrollEnd');
    }
  });

  angular.element($window).bind('resize', function () {
    $rootScope.$broadcast('resize');
  });

  layout.init();
  if (session.token) {
    if (session.is_registration_complete) {
      profile.load()
        .then(function () {
          profile.checkRemind();
        })
      ;
      if (!$location.path() || '/' === $location.path()) {
        $location.path('/main');
      }
    } else {
      $location.path('/profile');
    }
  } else {
    $location.path('/login');
  }

  iStorageMemory.put('home-activities-need-load', true);

}).config(function ($compileProvider) {
//    $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel):/);
}).config(['GoogleMapApiProvider'.ns(), function (GoogleMapApi) {
  GoogleMapApi.configure({
    //    key: 'your api key',
    v: '3.18',
    libraries: 'places'
  });
}]).config(function (CacheFactoryProvider) {
    angular.extend(CacheFactoryProvider.defaults, { maxAge: 15 * 60 * 1000 });
});