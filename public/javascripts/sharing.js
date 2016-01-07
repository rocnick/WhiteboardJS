/**
 * @description Event Handler for the add/remove users from the sharing group of a particular board.
 */
function selectSwap() {
  var outerContainer = getOuterContainer(this);
  var fromList = $(outerContainer).find('.' + $(this).data('from') + ':first');
  var toList = $(outerContainer).find('.' + $(this).data('to') + ':first');

  // Make swap
  $(fromList).find('option:selected').remove().appendTo(toList);
  $(toList).find('option:selected').removeAttr('selected');

  var visibility = getVisibility(this);
  var sharedUsers = getSharedUsers(this);
  var board = getBoard(this);

  var boardToSave = prepareBoard(board, visibility, sharedUsers);
  sendChanges(boardToSave);
}

/**
 * @description Event Handler for the visibility change of a particular board.
 */
function visibilityChange() {
  var visibility = getVisibility(this);
  var sharedUsers = getSharedUsers(this);
  var board = getBoard(this);

  var boardToSave = prepareBoard(board, visibility, sharedUsers);
  sendChanges(boardToSave);
}

function getSharedUsers(that) {
  if (eleHasClass(that, 'sharedUsers')) {
    return getUsersFromOptions($(that + ' option'));
  }

  var outerContainer = getOuterContainer(that);
  if (outerContainer !== null) {
    return getUsersFromOptions($(outerContainer).find('.sharedUsers:first option'));
  }

  return [];
}

function getUsersFromOptions(sharedUsers) {
  var shared = [];
  for (var i = 0, l = sharedUsers.length; i < l; i++) {
    shared.push({_id: sharedUsers[i].value, Username: sharedUsers[i].innerHTML});
  }
  return shared;
}

function getVisibility(that) {
  if (eleHasClass(that, 'visibility')) {
    return that.value;
  }

  var outerContainer = getOuterContainer(that);
  if (outerContainer !== null) {
    return $(outerContainer).find('.visibility:first').val();
  }

  return 'private';
}

function getOuterContainer(that) {
  var outerContainer = that;
  while (outerContainer.nodeName != '#document') {
    if (eleHasClass(outerContainer, 'boardShare')) {
      return outerContainer;
    }
    outerContainer = outerContainer.parentNode;
  }
  return null;
}

function eleHasClass(ele, className) {
  for (var i = 0, l = ele.classList.length; i < l; i++) {
    if (ele.classList[i] == className) {
      return true;
    }
  }
  return false;
}

function prepareBoard(board, visibility, sharedUsers) {
  board.Shared = sharedUsers;
  board.Sharing = visibility;
  delete board.Polygons;
  delete board.AvailableUsers;
  delete board.$$hashKey;

  return board;
}

function getBoard(that) {
  var outerContainer = getOuterContainer(that);
  if (outerContainer === null) {
    return null;
  }

  var boardId = $(outerContainer).find('svg:first').data('boardid');

  for (var i = 0, l = boardInfo.length; i < l; i++) {
    if (boardInfo[i].BoardID == boardId) {
      return boardInfo[i];
    }
  }

  return null;
}

function sendChanges(boardToSave) {
  window.Whiteboard.socket.emit('saveBoard', boardToSave);
}
