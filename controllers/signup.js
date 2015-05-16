// Nick Snyder
// Signup Controller

var wbEncryption = require(__dirname + '/wbEncryption');
var crypto = require('crypto');
var User = require('../dal/user');
var res = null;

module.exports = Signup;

function Signup()
{
  this.form = (typeof arguments[0] === 'object') ? arguments[0] : null;
  res = (typeof arguments[1] !== 'undefined') ? arguments[1] : null;
  this.invalid = false;
  this.errors = [];

  if(this.form == null || this.hasEmpty() || this.isInvalid())
  {
    return errors;
  }

  // Encrypt the password
  this.form.password = this.form.password2 = wbEncryption.encrypt(this.form.password);

  // Hash the password
  this.form.password = this.form.password2 = crypto.createHash('sha256').update(this.form.password).digest('hex');

  // After ensuring the user doesn't exist, create them
  if(!this.userExists())
  {
    var createUser = new User(null, this.form.username, this.form.password, this.form.fName, this.form.lName, this.form.email);

    createUser.insert(function(result) {
      if(!result)
      {
        res.render('signup', { title: 'WhiteboardJS' });
      }
      else
      {
        // Generate an expiration date
        var expirationTime = 604800000; // One week in milliseconds

        res.status(200);
        res.cookie('wbUser', result, { maxAge: expirationTime });
        
        res.redirect('/');
      }
    });
  }
}

Signup.prototype = {
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

    if(this.form.fName == '')
    {
      toReturn = true;
      this.errors.push('Please enter a First Name');
    }
    if(this.form.lName == '')
    {
      toReturn = true;
      this.errors.push('Please enter a Last Name');
    }
    if(this.form.username == '')
    {
      toReturn = true;
      this.errors.push('Please enter a Username');
    }
    if(this.form.email == '')
    {
      toReturn = true;
      this.errors.push('Please enter an Email Address');
    }
    if(this.form.password == '')
    {
      toReturn = true;
      this.errors.push('Please enter a password');
    }
    if(this.form.password2 == '')
    {
      toReturn = true;
      this.errors.push('Please confirm your password');
    }
    if(this.form.password != this.form.password2)
    {
      toReturn = true;
      this.errors.push('Please ensure your passwords match');
    }

    return toReturn;
  },
  userExists: function() {
    return false;
  },
};