module.exports = Credentials;

function Credentials()
{
  this.host = (typeof arguments[0] !== 'undefined') ? arguments[0] : 'whiteboardjs.com';
  this.port = (typeof arguments[1] !== 'undefined') ? arguments[1] : '27017';
  this.db = (typeof arguments[2] !== 'undefined') ? arguments[2] : 'whiteboard';
}

Credentials.prototype = {
  getUrl: function()
  {
    return 'mongodb://' + this.host + ':' + this.port + '/' + this.db;
  }
};