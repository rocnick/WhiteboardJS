//  Project:   Whiteboard JS
//  Author:    Nick Snyder

module.exports = Credentials;

function Credentials()
{
  this.host = (typeof arguments[0] !== 'undefined') ? arguments[0] : 'whiteboardjs.com';
  this.user = (typeof arguments[1] !== 'undefined') ? arguments[1] : 'wbUser';
  this.password = (typeof arguments[2] !== 'undefined') ? arguments[2] : '2ControlTheWorld';
  this.database = (typeof arguments[3] !== 'undefined') ? arguments[3] : 'whiteboard';
}