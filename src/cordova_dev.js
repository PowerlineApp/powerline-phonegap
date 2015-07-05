if (!window.navigator.notification) {
  window.navigator.notification = {};
}

window.navigator.notification.confirm = function(title, callback) {
  return confirm('title:' + title) ? callback(2) : callback(1);
};

window.navigator.notification.alert = function (message, alertCallback, title, buttonName) {
  console.log('alert called: ', arguments);
  alert(message);
  if (alertCallback){
    alertCallback();
  }
};

if (!window.cordova) {
  window.cordova = {};
}

if (!window.cordova.plugins){
  window.cordova.plugins = {};
}

window.cordova.plugins.Keyboard = window.cordova.plugins.Keyboard || {
  close: function () {},
  hideKeyboardAccessoryBar: function () {}
};

setTimeout(function () {
  var event = new CustomEvent('deviceready');
  document.dispatchEvent(event);
}, 500);

(function (window, angular, document) {
  var root = angular.element(document.getElementsByTagName('html'));

  var watchers = [];

  var f = function (element) {
    angular.forEach(['$scope', '$isolateScope'], function (scopeProperty) {
      if (element.data() && element.data().hasOwnProperty(scopeProperty)) {
        angular.forEach(element.data()[scopeProperty].$$watchers, function (watcher) {
          watchers.push(watcher);
        });
      }
    });

    angular.forEach(element.children(), function (childElement) {
      f(angular.element(childElement));
    });
  };


  window.watchers = function() {
    watchers = [];
    f(root);

    // Remove duplicate watchers
    var watchersWithoutDuplicates = [];
    angular.forEach(watchers, function(item) {
      if(watchersWithoutDuplicates.indexOf(item) < 0) {
        watchersWithoutDuplicates.push(item);
      }
    });

    return watchersWithoutDuplicates.length;
  };


})(window, angular, document);