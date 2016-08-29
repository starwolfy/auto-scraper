module.exports = function(url) {
    //  Returns boolean, true = internal, false = external

    var PATTERN_FOR_EXTERNAL_URLS = /^(\w+:)?\/\//;

    if (url.search(PATTERN_FOR_EXTERNAL_URLS) === -1) {
        return true;
    } else {
        return false;
    }

}