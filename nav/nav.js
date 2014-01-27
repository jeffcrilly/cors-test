
$(document).ready(function() {
	
	if ( window.XDomainRequest ) {
	        jQuery.ajaxTransport(function( s ) {
	                if ( s.crossDomain && s.async ) {
	                        if ( s.timeout ) {
	                                s.xdrTimeout = s.timeout;
	                                delete s.timeout;
	                        }
	                        var xdr;
	                        return {
	                                send: function( _, complete ) {
	                                        function callback( status, statusText, responses, responseHeaders ) {
	                                                xdr.onload = xdr.onerror = xdr.ontimeout = jQuery.noop;
	                                                xdr = undefined;
	                                                complete( status, statusText, responses, responseHeaders );
	                                        }
	                                        xdr = new XDomainRequest();
	                                        xdr.onload = function() {
	                                                callback( 200, "OK", { text: xdr.responseText }, "Content-Type: " + xdr.contentType );
	                                        };
	                                        xdr.onerror = function() {
	                                                callback( 404, "Not Found" );
	                                        };
	                                        xdr.onprogress = jQuery.noop;
	                                        xdr.ontimeout = function() {
	                                                callback( 0, "timeout" );
	                                        };
	                                        xdr.timeout = s.xdrTimeout || Number.MAX_VALUE;
	                                        xdr.open( s.type, s.url );
	                                        xdr.send( ( s.hasContent && s.data ) || null );
	                                },
	                                abort: function() {
	                                        if ( xdr ) {
	                                                xdr.onerror = jQuery.noop;
	                                                xdr.abort();
	                                        }
	                                }
	                        };
	                }
	        });
	}

var navItems = new Array();
navItems = [
	{ id: "oneId", text: "service one", href: "http://one.crilly.org"},
	{ id: "twoId", text: "service two", href: "http://two.crilly.org"},
	{ id: "threeId", text: "service three", href: "http://three.crilly.org"},
];

$.each( navItems, function( key, value ) {
	console.log("value is " + value);
	$("#nav").append(
		$('<li></li>', { id: "nav_"+value.id })
	);
	$("#nav_"+value.id).append(
		$('<a></a>', {
			id   : "nav_link_"+value.id, 
			text : value.text,
			href : value.href
		})
	);
});

var inboxDiv = $("#navDiv").after("<div id='inbox'>inbox (mouse over me)</div>");
inboxDiv.append(
	$("<div id='message' style='display:block'>&nbsp;</div>")
);

$("#inbox").hover(showInbox,hideInbox);

function showInbox() {
	
	$.ajax({
		type: 'GET',
		url: 'http://nav.crilly.org/notifications.json',
		dataType: 'json'
	}).done(function(msg) {
		console.log("msg is " + msg.content);
		if (msg != '') {
			$('#message').html("nav.crilly.org domain says => " + msg.content);
		}
	}).fail(function(error) {
		alert("server not available " + error);
	});
}

function hideInbox() {
	$('#message').html('&nbsp;');
}

});