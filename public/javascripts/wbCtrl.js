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

  if (typeof users !== 'undefined' && users !== null) {
    // Sort the users alphabetically by username
    users = users.sort(function(a, b) {
      var aName = a.Username.toLowerCase();
      var bName = b.Username.toLowerCase();
      return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    });

    $scope.users = users;
  }

  if (typeof boardInfo !== 'undefined' && boardInfo !== null) {
    // Append available users to each board
    if (typeof users !== 'undefined' && users !== null) {
      for (var i = 0, l = boardInfo.length; i < l; i++) {
        if (typeof boardInfo[i].Shared !== 'object' || boardInfo[i].Shared === null) {
          continue;
        }

        boardInfo[i].AvailableUsers = [];
        for (var j = 0, m = users.length; j < m; j++) {
          if (isUserAvailable(users[j], boardInfo[i].Shared)) {
            boardInfo[i].AvailableUsers.push(users[j]);
          }
        }
      }
    }

    $scope.boardInfo = boardInfo;
  }

  $scope.loginError = null;
  if (typeof loginError !== 'undefined' && loginError !== null) {
    $scope.loginError = loginError;
  }

  function isUserAvailable(user, shared) {
    for (var i = 0, l = shared.length; i < l; i++) {
      if (shared[i]._id === user._id) {
        return false;
      }
    }

    return true;
  }
});
