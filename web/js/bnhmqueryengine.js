function search() {
    theUrl = "https://ecoengine.berkeley.edu/api/search/?format=json&q=";
    if ($("#namesoup").val().length <= 0) {
        $("#namesoup").addClass("has-error");
        return;
    } else {
        $("#namesoup").removeClass("has-error");
    }
    displaySearch(theUrl,$("#namesoup").val());
}

function displaySearch(theUrl,modifier) {
    var trHTML = '';
    //$.getJSON( theUrl + $("#namesoup").val() + "?" + $("form").serialize(), function(data) {
    $.getJSON( theUrl + modifier , function(data) {

       $.each(data.fields, function( key, value ) {
            //alert(key);
            trHTML += "<div class='col-md-1'>";
            trHTML += "<b>" +  key + "</b>";
            $.each(value, function (name, someArray) {
               // Following assumes a particular structure on ecoengine responses
               trHTML += "<li><a href='#' onclick='displaySearch(\"" +someArray[2]+"&format=json\",\"\");'>"+someArray[0]+"</a> (" + someArray[1] + ")</li>";
            });
            trHTML += "</div>";
       });
       // Update results table
       $("#results").html(trHTML);
    }).fail(function(jqXHR,textStatus) {
        if (textStatus == "timeout") {
            showMessage ("Timed out waiting for response! Try again later or reduce the number of graphs you are querying. If the problem persists, contact the System Administrator.");
        } else {
            showMessage ("Error completing request!");
        }
    });
}
function observations() {
    theUrl = "https://ecoengine.berkeley.edu/api/observations/?format=json&q=";
    if ($("#namesoup").val().length <= 0) {
        $("#namesoup").addClass("has-error");
        return;
    } else {
        $("#namesoup").removeClass("has-error");
    }
    displayObservations(theUrl,$("#namesoup").val());
}

function displayObservations(theUrl,modifier) {
    var trHTML = 'There may be more in here, need to get pages, etc...<p>';
    //$.getJSON( theUrl + $("#namesoup").val() + "?" + $("form").serialize(), function(data) {
    $.getJSON( theUrl + modifier , function(data) {

       $.each(data.results, function( key, value ) {
            var url = '';
            var record = '';
            $.each(value, function (obsKey, obsVal) {
               if (obsKey == "url") { url = obsVal; }
               if (obsKey == "record") { record = obsVal; }
            });

            trHTML += "<li><a href='" + url + "'>" + record +"</a>";
       });
       // Update results table
       $("#results").html(trHTML);
    }).fail(function(jqXHR,textStatus) {
        if (textStatus == "timeout") {
            showMessage ("Timed out waiting for response! Try again later or reduce the number of graphs you are querying. If the problem persists, contact the System Administrator.");
        } else {
            showMessage ("Error completing request!");
        }
    });
}

function showSection(section_id, galIndex) {
    (function(section_id, galIndex) {
        $.getJSON("rest/sections/" + section_id, function(data) {

        $.fancybox.open(data.pages, {
             padding     : [15, 190, 15, 15],
             nextEffect  : 'fade',
             prevEffect  : 'fade',
             autoSize    : true,
             helpers     : {
                 thumbs  : {
                    width: 75,
                    height: 103,
                    source: function( item ) {
                        return item.thumb;
                    }
                 }
             },
             beforeShow: function(){
                  var sidebar = $('<div class="fancybox-sidebar"><div class="fancybox-sidebar-container"></div></div>');
                  this.skin.append(sidebar);

                  var html = "<div class='fancybox-img-download'><p>Download Image:</p><a href='' id='600' download='image.png'>600</a>" +
                             "<a href='' id='high_res' download='high_res.tif'>high res</a></div>";
                  if (this.group.length > 1) {
                      html += "<div class='fancybox-page-nav'>" +
                              "<a href='#' class='btn btn-default' onClick='$.fancybox.jumpto(0);'>First</a>" +
                              "<a href='#' class='btn btn-default'style='float:right;' " +
                              "onClick='$.fancybox.jumpto($.fancybox.group.length - 1);'>Last</a></div>";
                  }

                  $(".fancybox-tmp .fancybox-sidebar-container").html(html);
                  $(".fancybox-img-download a#600").attr("href", this.big);
                  $(".fancybox-img-download a#high_res").attr("href", this.high_res);
             },
             onUpdate: function() {
                $(".fancybox-sidebar").height(this.inner.height());
             },
             afterShow: function() {
                if (galIndex != null) {
                    $.fancybox.jumpto(galIndex);
                    galIndex = null;
                }

                $("<a id='img_link' href='#'></a>").insertAfter(".fancybox-prev");

                $("#img_link").click( {href: this.big} ,function(event) {
                      (function(index) {
                          $.fancybox.close();
                          $.fancybox.open({
                            width: "100%",
                            height: "100%",
                            href: event.data.href,
                            type: "iframe",
                            afterClose: function() {
                                showSection(section_id, index);
                            }
                          });
                      })($.fancybox.current.index);
                });
             }
            });
        }).fail(function(jqXHR,textStatus) {
            if (textStatus == "timeout") {
                showMessage ("Timed out waiting for response! Try again later or reduce the number of graphs you are querying. If the problem persists, contact the System Administrator.");
            } else {
                showMessage ("Error completing request!");
            }
        });
    })(section_id, galIndex);
}

// A short message
function showMessage(message) {
$('#alerts').append(
        '<div class="alert">' +
            '<button type="button" class="close" data-dismiss="alert">' +
            '&times;</button>' + message + '</div>');
}

function toggleQuery() {
    if ($('.toggle-content#query_toggle').is(':hidden')) {
        $('.toggle-content#query_toggle').show(400);
        $('#toggle_query button').html("-");
    } else {
        $('.toggle-content#query_toggle').hide(400);
        $('#toggle_query button').html("+");
    }
}

