var dns = require('dns'),
    async = require('async'),
    request = require('request'),
    cheerio = require('cheerio'),
    url = require('url'),
    absoluteSelector = require('./absoluteselector'),
    urlType = require('./urltype');

module.exports = function(io) {
    io.on('connection', function (socket) {

        socket.on('submitClicked', function(msg, respond) {

            var index = msg.inputIndex,
                example = msg.inputExample,
                next = msg.inputNext;


            //  Callbacked errors get sent and printed on the client's end.
            async.waterfall([
                function(callback) {

                    //  Adding protocol to index variable if not provided.
                    if (index.indexOf('http://') == -1 && index.indexOf('https://') == -1) {
                        index = "http://" + index;
                    }

                    //  Requesting jobs index page.
                    
                    request(index, function (err, response, html) {
                        if(err != null) {
                            callback("Invalid index URL: " + err.code);
                        } else if (response.statusCode != 200) {
                            callback("Server replied with status code: " + response.statusCode)
                        } else {
                            callback(null, html);
                        }
                    });
                    

                },
                function(html, callback) {

                    //  Start digging through the HTML using cheerio (jquery-a-like)

                    var $ = cheerio.load(html);

                    var normalIndex = index.split("?")[0];
                    
                    for (var i=0; i < $('a').length; i++) {
                        //  Make all 'a' href links absolute.
                        //  Bug: doesn't always catch all a elements.

                        var currentLink = $('a')[i].attribs.href;

                        if (typeof currentLink === "string") {

                            if (urlType(currentLink)) {

                                var absoluteLink = url.resolve(normalIndex, currentLink);
                                $('a')[i].attribs.href = absoluteLink;

                            }
                        }

                    }

                    //  Get the class of the scraped a element
                    //  or get complete class-only selector of first scraped 'a' element and check if it applies to the other two given examples.
                    
                    var example_selector = "a[href='" + example + "']";
                    var vacancySelector = absoluteSelector($, example_selector);

                    var nextSelector = "";
                    var nextUsed = false;

                    var nextIndex = 0;

                    if (next != "") {
                        //  If next button not provided.
                        nextUsed = true;
                        var next_selector = "a[href='" + next + "']";
                        nextSelector = absoluteSelector($, next_selector);

                        if ($(nextSelector).length > 1) {
                            //  Multiple elements found with next selector.

                            for (var i=0; i < $(nextSelector).length ;i++) {

                                if ($(nextSelector)[i].attribs.href == next) {
                                    nextIndex = i;
                                    break;
                                }

                            }

                        }

                    }

                    var vacancyLinks = [];

                    for (var i=0; i < $(vacancySelector).length ; i++) {
                        if (typeof $(vacancySelector)[i].attribs.href !== "string") {
                            //  Website has a element with no href value adjacent to the a elements which do have it.
                            continue;
                        }
                        vacancyLinks.push($(vacancySelector)[i].attribs.href);
                    }

                    //  null when a element with provided href attribute couldn't be found.
                    if (vacancySelector == null) {
                        callback("Website uses JavaScript or cannot find example from given index page.");
                    } else if (nextSelector == null) {
                        callback(null, {links: vacancyLinks, selector: vacancySelector, nextSelector: nextSelector, more: false});
                    } else {
                        callback(null, {links: vacancyLinks, selector: vacancySelector, nextSelector: nextSelector, more: nextUsed});
                    }

                    //  Runs after callback.
                    if (nextUsed) {

                        var lastPage = false;
                        var fetchMe = next;
                        var newVacancies = [];
                        var visitedPages = {};
                        var amountOfPagesVisited = 0;

                        async.doUntil(function(callback2) {
                            //  Execute callback2 to perform a truth test. When lastPage = true, this function will no longer be called.
                            //  Do:
                            
                            amountOfPagesVisited++;
                            if(amountOfPagesVisited >= 10) {
                                lastPage = true;
                            }

                            visitedPages[fetchMe] = true;
                            console.log("Visiting: " + fetchMe);
                            
                            request(fetchMe, function (err, response, body) {
                                if(err != null) {
                                    callback2("Invalid 'next' URL: " + err.code);
                                } else if (response.statusCode != 200 && response.statusCode != 301) {

                                    callback2("Webpage from next button returns status code: " + response.statusCode);

                                } else {
                                    //  Succesfully fetched page from next button.
                                    //  To do: change fetchMe to next url and dump new vacancies to client.
                                    newVacancies = [];

                                    $ = cheerio.load(body);


                                    for (var i=0; i < $('a').length; i++) {
                                        //  Make all 'a' href links absolute.

                                        currentLink = $('a')[i].attribs.href;

                                        if (typeof currentLink === "string") {

                                            if (urlType(currentLink)) {

                                                normalIndex = fetchMe.split("?")[0];
                                                absoluteLink = url.resolve(normalIndex, currentLink);
                                                $('a')[i].attribs.href = absoluteLink;

                                            }
                                        }

                                    }

                                    if ($(nextSelector).length > 0) {
                                        //  If next button doesn't have unique selector.
                                        var foundLink = false;

                                        for (i=0; i < $(nextSelector).length; i++) {

                                            var currentHref = $(nextSelector)[i].attribs.href;

                                            if (!visitedPages[currentHref] && typeof currentHref !== "undefined") {
                                                fetchMe = currentHref;
                                                foundLink = true;
                                                break;
                                            } else {
                                                continue;
                                            }

                                        }

                                        if (!foundLink) {
                                            //  Broke out of loop without finding a link we haven't seen yet.
                                            lastPage = true;
                                        }

                                        //  Get all vacancies and emit.

                                        for (var i=0; i < $(vacancySelector).length ; i++) {
                                            if (typeof $(vacancySelector)[i].attribs.href !== "string") {
                                                //  Website has a element with no href value adjacent to the a elements which do have it.
                                                continue;
                                            }
                                            newVacancies.push($(vacancySelector)[i].attribs.href);
                                        }

                                        if (newVacancies.length == 0) {
                                            lastPage = true;
                                        }
                                        socket.emit('moreData', newVacancies);
                                        callback2(null);

                                    } else {
                                        //  If next button does have a unique selector.

                                        for (var i=0; i < $(vacancySelector).length ; i++) {
                                            if (typeof $(vacancySelector)[i].attribs.href !== "string") {
                                                //  Website has a element with no href value adjacent to the a elements which do have it.
                                                continue;
                                            }
                                            newVacancies.push($(vacancySelector)[i].attribs.href);
                                        }

                                        socket.emit('moreData', newVacancies);
                                        fetchMe = $(nextSelector).attr('href');
                                        if (typeof fetchMe === "undefined" || newVacancies.length == 0) {
                                            lastPage = true;
                                        }
                                        callback2(null);

                                    }
                                }
                            });

                        }, function() {
                            //  While:
                            return lastPage;
                        }, function(err) {
                            //  Executed when truth test passed.

                            if (err != null) {
                                console.log(err);
                                return;
                            } else {
                                console.log("Obtained all vacancies.");
                            }

                        });

                    }

                }
            ], function(err, result) {
                //  Send client either an error message or list of vacancies with used selector.
                if(err != null) {
                    respond({error: err, data: null});
                } else {
                    respond({error: null, data: result});
                }


            });

        });

    });
}