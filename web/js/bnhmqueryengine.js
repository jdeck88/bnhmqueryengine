// Global variable object for BNHMQueryEngine
var bqe = {};
bqe.searchRoot ="https://ecoengine.berkeley.edu/api/search/";  // Faceted Search API Root
bqe.observationsRoot = "https://ecoengine.berkeley.edu/api/observations/"; // Observations API Root
bqe.sourcesRoot = "https://ecoengine.berkeley.edu/api/sources/";
bqe.bnhmSourceIDs = [17,13,14,15,16,19,21,1,20,5,12]; // All of the datasource ID's
bqe.observations_page_size = 200;
bqe.bm_configfile = "http://huxley.bnhm.berkeley.edu/bnhmqueryengine/bm_bqe.xml";

// Construct query to add just the BNHM Source ID's
function addBNHMSources(urlString) {

}

// Check that a particular value is good or not
function checkValue(a) {
    if (a.val().length <= 0) {
        a.addClass("has-error");
        return false;
    } else {
        a.removeClass("has-error");
        return true;
    }
}

// Get only the query string from a full url, remove the leading "?"
function queryString(urlString) {
    var uri = new URI(urlString);
    return uri.query();
}

// Call the ecoengine faceted search with just query parameters as an argument
function search(q) {
    var html = '';
    var uri = new URI(bqe.searchRoot);
    uri.search(q);

    // Get the JSON data
    $.getJSON( uri.toString() , function(data) {
       // Loop the Fields array
       $.each(data.fields, function( key, value ) {
            html += "<div class='col-md-1'>";
            html += "<b>" +  key + "</b>";
            $.each(value, function (name, someArray) {
               // Following assumes a particular structure on ecoengine responses
               html += "<li><a href='#' onclick='search(queryString(\"" +someArray[2]+"\"));'>"+someArray[0]+"</a> (" + someArray[1] + ")</li>";
            });
            html += "</div>";
       });
       // Update results table
       $("#results").html(html);
    }).fail(function(jqXHR,textStatus) {
        if (textStatus == "timeout") {
            showMessage ("Timed out waiting for response! Try again later or reduce the number of graphs you are querying. If the problem persists, contact the System Administrator.");
        } else {
            showMessage ("Error completing request!");
        }
    });
}

// Get BerkeleyMapper Link
function getBerkeleyMapperLink(observationsURL) {
    var uri = new URI(observationsURL);
    // Remove the following just in case
    uri.removeSearch("format");
    uri.removeSearch("page_size");
    // Add the CSV format
    uri.addSearch("format","map");
    // Set the mapper search size really big
    uri.addSearch("page_size",10000);
    uri.addSearch("fields","record,recorded_by,url,scientific_name,geojson");
    var encodedURI = encodeURIComponent(uri.toString());
    var encodedConfigURI = encodeURIComponent(bqe.bm_configfile)
    var bmURI = new URI("http://berkeleymapper.berkeley.edu/index.html?tabfile="+encodedURI+"&configfile=" +encodedConfigURI);
    return bmURI.toString();
}

// Get observations & very brief results
function observations(modifier) {

    var uri = new URI(bqe.observationsRoot);
    uri.search(modifier);
    var html = "<a href='" + getBerkeleyMapperLink(uri.toString()) + "'>Map all results with BerkeleyMapper</a>";

    var html += "<p>";

    // Add our default pagesize
    uri.addSearch("page_size",bqe.observations_page_size);

    $.getJSON( uri.toString() , function(data) {

        // Loop all the data results
        html += "<table>";
       $.each(data.results, function( key, value ) {
            html += "<tr>";
            var url = '';
            var record = '';
            var scientific_name ='';
            var date = '';
            var locality = '';
            var recorded_by = '';
            $.each(value, function (obsKey, obsVal) {
                if (obsKey == "url") { url = obsVal; }
                if (obsKey == "record") { record = obsVal; }
                if (obsKey == "scientific_name") { scientific_name = obsVal; }
                if (obsKey == "begin_date") { date = obsVal; }
                if (obsKey == "recorded_by") { recorded_by = obsVal; }
            });
            html += "<td>";
            html += scientific_name;
            html += "</td><td>";
            html += date;
            html += "</td><td>";
            html += recorded_by;
            html += "</td><td>";
            html += "<a href='" + url + "'>" + record +"</a>";
            html += "</td>";
            html += "</tr>";

       });
       html += "</table>";
       // Update results table
       $("#results").html(html);
    }).fail(function(jqXHR,textStatus) {
        if (textStatus == "timeout") {
            showMessage ("Timed out waiting for response! Try again later or reduce the number of graphs you are querying. If the problem persists, contact the System Administrator.");
        } else {
            showMessage ("Error completing request!");
        }
    });
}

// Show some short message
function showMessage(message) {
$('#alerts').append(
        '<div class="alert">' +
            '<button type="button" class="close" data-dismiss="alert">' +
            '&times;</button>' + message + '</div>');
}

// Toggle expanded query section
function toggleQuery() {
    if ($('.toggle-content#query_toggle').is(':hidden')) {
        $('.toggle-content#query_toggle').show(400);
        $('#toggle_query button').html("-");
    } else {
        $('.toggle-content#query_toggle').hide(400);
        $('#toggle_query button').html("+");
    }
}