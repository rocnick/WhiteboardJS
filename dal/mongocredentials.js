module.exports = Credentials;

function Credentials()
{
  this.host = (typeof arguments[0] !== 'undefined') ? arguments[0] : 'localhost';
  this.port = (typeof arguments[1] !== 'undefined') ? arguments[1] : '27017';
  this.collection = (typeof arguments[2] !== 'undefined') ? arguments[2] : 'whiteboard';
}

Credentials.prototype = {
  getUrl: function()
  {
    return 'mongodb://' + this.host + ':' + this.port + '/' + this.collection;
  }
}