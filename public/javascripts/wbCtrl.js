//  Project:   Whiteboard JS
//  Author:    Nick Snyder

var whiteboardApp = angular.module('whiteboardApp', []);

whiteboardApp.controller('wbCtrl', function($scope) {
  $scope.loggedIn = false;

  if (typeof userInfo !== 'undefined' && userInfo !== null)
  {
    $scope.loggedIn = true;
    $scope.userInfo = userInfo;
  }
});