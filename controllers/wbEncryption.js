module.exports = {
  encrypt: function(str) {
    var toReturn = null;

    var reverseEncoded = this.reverse(new Buffer(str).toString('base64'));
    var segments = reverseEncoded.match(/.{1,4}/g);
    
    var seg = segments.splice(0, Math.ceil(segments.length / 2));
    segments = segments.concat(seg);

    toReturn = segments.join('');

    return toReturn;
  },
  decrypt: function(str) {
    var toReturn = null;

    var segments = str.match(/.{1,4}/g);

    var seg = segments.splice(0, Math.ceil(segments.length / 2));
    segments = segments.concat(seg);

    var joined = segments.join('');
    toReturn = this.reverse(new Buffer(joined, 'base64').toString('ascii'));

    return toReturn;
  },
  reverse: function(str) {
    if (str === '') {
        return '';
    } else {
        return this.reverse(str.slice(1)) + str.charAt(0);
    }
  }  
}