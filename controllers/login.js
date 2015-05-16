var wbEncryption = require(__dirname + '/wbEncryption');
var crypto = require('crypto');
var User = require('../dal/user');
var res = null;

module.exports = Login;

function Login()
{
  this.form = (typeof arguments[0] === 'object') ? arguments[0] : null;
  res = (typeof arguments[1] !== 'undefined') ? arguments[1] : null;
  this.invalid = false;
  this.errors = [];

  if(this.form == null || this.hasEmpty() || this.isInvalid())
  {
    res.render('login', { title: 'WhiteboardJS' });
  }

  // Encrypt the password
  this.form.password = this.form.password2 = wbEncryption.encrypt(this.form.password);

  // Hash the password
  this.form.password = this.form.password2 = crypto.createHash('sha256').update(this.form.password).digest('hex');

  var checkedUser = new User(null, null, this.form.password, null, null, this.form.email);

  checkedUser.login(function(result) {
    if(!result)
    {
      res.render('login', { title: 'WhiteboardJS' });
    }
    else
    {
      // Generate an expiration date
      var expirationTime = 604800000; // One week in milliseconds

      var userInfo = {
        userId: checkedUser.UserID,
        username: checkedUser.Username,
        first: checkedUser.FirstName,
        last: checkedUser.LastName,
        email: checkedUser.EmailAddress
      };

      res.status(200);
      res.cookie('wbUser', userInfo, { maxAge: expirationTime });

      res.redirect('/');
    }
  });
}

Login.prototype = {
  hasEmpty: function() {
    for(var i = 0, l = this.form.length; i < l; i++)
    {
      if(this.form[i] == '')
      {
        this.errors.push('Please fill out the form completely');
        return true;
      }
    }

    return false;
  },
  isInvalid: function() {
    var toReturn = false;

    if(this.form.email == '')
    {
      toReturn = true;
      this.errors.push('Please enter a valid Email Address');
    }
    if(this.form.password == '')
    {
      toReturn = true;
      this.errors.push('Please enter a password');
    }

    return toReturn;
  }
};