var db = require('mongodb');
var crypto = require(__dirname + '/wbEncryption');

module.exports = {
  verifyCredentials: function(creds) {
    // Encrypt the password
    creds.password = crypto.encrypt(creds.password);
    console.log(creds);

    creds.password = crypto.decrypt(creds.password);
    console.log(creds);
    return true;
  }
};