module.exports = function($, selector) {
    //  $ = cheerio loaded html

    if ($(selector).length == 0 && typeof $(selector).attr() == "undefined") {
        return null;
    }

    var completeSelector = "a";

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
    
    if ($(completeSelector).length == 1) {
        completeSelector = "a";
        currentElement = $(selector);
        
        for (var i=0; i < $(selector).parents().length; i++) {
            if (typeof currentElement.get(0) !== "undefined") {
                if (currentElement.get(0).name == "html") {
                    break;
                }
            }
            
            currentSort = currentElement.parent().get(0).tagName;
            completeSelector = currentSort + " > " + completeSelector;
            currentElement = currentElement.parent();
            
        }
        
    }

    return completeSelector;

    

}