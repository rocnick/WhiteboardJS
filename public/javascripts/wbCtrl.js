//  Project:   Whiteboard JS
//  Author:    Nick Snyder

var whiteboardApp = angular.module('whiteboardApp', []);

whiteboardApp.controller('wbCtrl', function($scope) {
  $scope.loggedIn = false;

  if (typeof userInfo !== 'undefined' && userInfo !== null)
  {
    $scope.loggedIn = userInfo.LoggedIn;
    $scope.userInfo = userInfo;
  }

  if (typeof boardInfo !== 'undefined' && boardInfo !== null) {
    $scope.boardInfo = boardInfo;
  }

  if (typeof users !== 'undefined' && users !== null) {
    $scope.users = users;
  }
});
