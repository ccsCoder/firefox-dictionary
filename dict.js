function init() {
	
}

//copied from Stackoverflow
function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

function createPopup() {
	var tempElem = document.createElement(div);
	tempElem.innerHTML = '<div class="popup">'+
		'<p>Lorem Ipsume dsajflkaj asldkjasdf lasdfjalskfaslkd jalsjf laskjfasljfasldjf lsadfsldakfjsdlf asfd</p>'+
		'<p>Lorem Ipsumsla kfsadjhhhhhhhhhhhhlk jsadkfaj salkdf jlsadkaaaaaaaaaaaaaj salkdfj laskjfsald;k fasdfjk sajfslkdajf'+
		'sadf saldfjsdlkf jslf;sjadf l;aslfjas</p></div>';

	var popup = tempElem.firstChild;

	document.querySelector("body").append(tempElem.firstChild);
	return tempElem.firstChild;


}

document.addEventListener("dblclick", function (e) {
	var selection = getSelection();
	console.log(selection);
	console.log(e);

});
