module.exports = function($, selector) {
    //  $ = cheerio loaded html

    if ($(selector).length == 0 && typeof $(selector).attr() == "undefined") {
        return null;
    }

    var completeSelector = "a";

    if (typeof $(selector).attr('class') === "undefined") {
        //  Scraped 'a' element doesn't have a class so let's get the full selector of all its parents.

        var currentClass = "";
        var currentElement = $(selector);

        for (var i=0; i < $(selector).parents().length; i++) {

            if (typeof currentElement.get(0) !== "undefined") {
                if (currentElement.get(0).name == "html") {
                    break;
                }
            }

            currentClass = currentElement.parent().attr('class');

            if (typeof currentClass === "undefined" || !/\S/.test(currentClass)) {
                //  Add element name to selector

                if (typeof currentElement.parent().get(0) !== "undefined") {
                    completeSelector = currentElement.parent().get(0).tagName + " > " + completeSelector;
                }

            } else {
                //  Add element class to selector

                if (currentClass.split(" ")[0] == "") {
                    continue;
                }

                completeSelector = "." + currentClass.split(" ")[0] + " > " + completeSelector;
            }

            currentElement = currentElement.parent();
        }

        return completeSelector;

    } else {
        //  Scraped 'a' element has a class, parents not needed.

        var addedAtr = $(selector).attr('class').split(' ').join('.');

        completeSelector = completeSelector + "." + addedAtr;
        return completeSelector;

    }

}