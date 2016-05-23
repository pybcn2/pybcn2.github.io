//XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

function httpGet(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    var http = location.protocol;
    var slashes = http.concat("//");
    var host = slashes.concat(window.location.hostname);
    xmlHttp.open("GET", theUrl, true); // false for synchronous request
    xmlHttp.send(null);
    if (xmlHttp.status == 301 || xmlHttp.status == 302) {
        newUrl = xmlHttp.getResponseHeader("Location");
        return httpGet(newUrl, callback);
    }
    return xmlHttp.responseText;
}

function timeTag(timestamp) {
    date = new Date(timestamp * 1000);
    time = "<time datetime=\"" + date.toISOString() + "\">";
    time += date.getFullYear() + "-" + date.getMonth() + "-";
    time += date.getDate() + "</time>";
    return time;
}

function eventLink(event) {
    return "<a href=\"" + event.link + "\">" + event.name + "</a>";
}

function processEvents(status) {
    baseUrl = "https://api.meetup.com/python-185/events?status=";
    events = JSON.parse(httpGet(baseUrl + status, null)).slice(-5);
    output = "";
    events.forEach(function(event) {
        output += "<li>" + timeTag(event.time) + " ";
        output += eventLink(event) + "</li>\n";
    });
    if ( output === "" ) {
        output = "<li>There are no " + status + " events scheduled... Stay tuned!</li>";
    }
    return output;
}

function updateUpcoming() {
    var node = document.getElementById("upcoming");
    node.innerHTML = processEvents("upcoming");
}

function updatePast() {
    var node = document.getElementById("past");
    node.innerHTML = processEvents("past");
}
