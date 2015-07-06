angular.module('app.services').factory('notifications',function ($window, device, notificationsData, onNotificationGCM, onNotificationAPN, serverConfig) {

  $window.onNotificationGCM = onNotificationGCM;
  $window.onNotificationAPN = onNotificationAPN;

  function register() {
    if (device.isIOS) {
      notificationsData.pushPlugin.register(notificationsData.registerIOS, angular.noop, {badge: 'true', sound: 'true', alert: 'true', ecb: 'onNotificationAPN'});

    } else if (device.isAndroid) {
      notificationsData.pushPlugin.register(angular.noop, angular.noop, {senderID: serverConfig.senderID, ecb: 'onNotificationGCM'});
    }
  }

  return {
    init: function () {
      notificationsData.pushPlugin = $window.plugins.pushNotification;
      register();
    }
  };

}).factory('onNotificationGCM',function (notificationsData) {

  return function (e) {
    if ('registered' === e.event) {
      notificationsData.regId = e.regid;
    } else if ('message' === e.event) {
      notificationsData.$apply(function () {
        (notificationsData.actions[e.payload.type] || angular.noop)(!e.foreground, e.payload.entity);
        if (e.foreground) {
          navigator.notification.beep(1);
          navigator.notification.vibrate(500);
        }
      });
    }
  };

}).factory('onNotificationAPN',function (notificationsData) {

  return function (e) {
    var entity = angular.isString(e.entity) ? angular.fromJson(e.entity) : e.entity;
    var target = angular.isString(e.target) ? angular.fromJson(e.target) : e.target;
    notificationsData.$apply(function () {
      (notificationsData.actions[e.type] || angular.noop)(!Number(e.foreground), entity || target);
      if (Number(e.foreground)) {
        navigator.notification.beep(1);
        navigator.notification.vibrate(500);
      }
    });
  };

}).factory('notificationsData',
  function ($rootScope, session, serverConfig, $http, activity, groupsInvites, follows, announcements, invites,
            homeCtrlParams, socialActivityTabManager, navigateTo, socialActivity) {

    var scope = $rootScope.$new();

    function loadBadgeData() {
      homeCtrlParams.loaded = false;
      $rootScope.$broadcast('notification.received');
      announcements.load();
      groupsInvites.load();
      follows.load();
    }

    function question(redirect, entity) {
      loadBadgeData();
      if (redirect && entity) {
        $rootScope.path('/questions/' + entity.id);
      }
    }

    function petition(redirect, entity) {
      loadBadgeData();
      if (redirect && entity) {
        $rootScope.path('/question/leader-petition/' + entity.id);
      }
    }

    function leaderNews(redirect, entity) {
      loadBadgeData();
      if (redirect && entity) {
        $rootScope.path('/questions/news/' + entity.id);
      }
    }

    function paymentRequest(redirect, entity) {
      loadBadgeData();
      if (redirect && entity) {
        $rootScope.path('/payment-polls/payment-request/' + entity.id);
      }
    }

    function leaderEvent(redirect, entity) {
      loadBadgeData();
      if (redirect && entity) {
        $rootScope.path('/leader-event/' + entity.id);
      }
    }

    function crowdfundingPaymentRequest(redirect, entity) {
      loadBadgeData();
      if (redirect && entity) {
        $rootScope.path('/payment-polls/crowdfunding-payment-request/' + entity.id);
      }
    }

    scope.actions = {
      activity: function (redirect) {
        if (redirect) {
          $rootScope.path('/main');
        }
      },
      group_petition: petition,
      group_question: question,
      representative_question: question,
      representative_petition: petition,
      superuser_question: question,
      group_news: leaderNews,
      representative_news: leaderNews,
      group_payment_request: paymentRequest,
      representative_payment_request: paymentRequest,
      group_payment_request_crowdfunding: crowdfundingPaymentRequest,
      representative_payment_request_crowdfunding: crowdfundingPaymentRequest,
      group_event: leaderEvent,
      representative_event: leaderEvent,
      micro_petition: function (redirect, entity) {
        loadBadgeData();
        if (redirect && entity) {
          $rootScope.path('/petition/' + entity.id);
        }
      },
      announcement: function (redirect) {
        if ('/messages' === $rootScope.path() || redirect) {
          announcements.setViewed();
        }

        announcements.load().then(function () {
          if (redirect) {
            $rootScope.path('/messages');
          }
        });
      },
      invite: function (redirect) {
        if (redirect && '/messages' !== $rootScope.path()) {
          $rootScope.path('/messages');
        } else {
          groupsInvites.load();
          invites.load();
        }
      },
      permissions: function (redirect, entity) {
        if (redirect) {
          $rootScope.path('/group/' + entity.id);
        }
      },
      influence: function (redirect) {
        if (redirect) {
          socialActivityTabManager.getState().reload = true;
          $rootScope.path('/influences/notifications');
        } else {
          follows.load().then(socialActivity.load);
        }
      },
      social_activity: function (redirect, entity) {
        if (redirect) {
          socialActivityTabManager.getState().reload = true;
          if (entity.target) {
            navigateTo('target', entity.target.type, entity.target.id);
          } else {
            $rootScope.path('/influences/notifications');
          }
        } else {
          socialActivity.load();
        }
      }
    };

    scope.$watch('regId', function (newValue, oldValue) {
      if (session.getToken() && newValue && newValue !== oldValue) {
        registerAndroid();
      }
    });

    scope.$watch('token', function (newValue, oldValue) {
      if (session.getToken() && newValue && newValue !== oldValue) {
        registerIOS();
      }
    });

    scope.$watch(session.getToken, function (newValue, oldValue) {
      if (newValue && scope.regId) {
        registerAndroid();
      }
      if (newValue && scope.token) {
        registerIOS();
      }
    });

    scope.$watch(activity.getNewActivities, function (newValue) {
      if (scope.pushPlugin && scope.token && newValue) {
        scope.pushPlugin.setApplicationIconBadgeNumber(angular.noop, newValue.length);
      }
    });

    scope.registerIOS = function (token) {
      scope.token = token;
    };

    function getEndpoints() {
      return $http.get(serverConfig.url + '/api/endpoints/').then(function (response) {
        return response.data;
      });
    }

    function handleDevice(data) {
      getEndpoints().then(function (endpoints) {
        if (!_(endpoints).chain().pluck('token').include(data.token).value()) {
          $http.post(serverConfig.url + '/api/endpoints/', data).catch(function (response) {
            console.error('Cannot add notification token');
            if (response.data) {
              console.error(angular.toJson(response.data));
            }
          });
        }
      });
    }

    function registerIOS() {
      handleDevice({type: 'ios', token: scope.token});
    }

    function registerAndroid() {
      handleDevice({type: 'android', token: scope.regId});
    }

    return scope;

  });