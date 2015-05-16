var res = null;

module.exports = Logout;

function Logout()
{
  res = (typeof arguments[0] !== 'undefined') ? arguments[0] : null;

  res.clearCookie('wbUser');

  res.redirect('/');
}