let dictionaryAPI = (function(activeAPI){
	activeAPI = activeAPI || 'google';
	const apis = {
		'owlbot': {
			'url': 'https://owlbot.info/api/v2/dictionary/',
			'uriSuffix': '',
			'dataTransformer': 'owlbotTransformer'
		},	
		'google': {
			'url': 'https://googledictionaryapi.eu-gb.mybluemix.net/',
			'uriSuffix' : '?define=',
			'dataTransformer': 'googleTransformer'
		}
	};

	function googleTransformer(json) {
		
	}
	
	const endpoint = apis[activeAPI].url + apis[activeAPI].urlSuffix;
	
	function _fetchWordDef(word) {
		let req = new Request(endpoint + word, {
			method: 'GET'
		});
		return fetch(req)
		.then((response)=>{
			if (response.status === 200) {
				return response.json();
			} else {
				throw response.status;
			}
		})
		.then((responseJson)=> {
			let transformer = apis[activeAPI].dataTransformer;
			transformer = transformer;
			return transformer(responseJson);

		})
		.catch((err)=> {
			return {
				error: err
			}
		})
	}

		

});

var dictionary = (function(){
	
	var popupRef;
	


	function init() {
		popupRef = createPopup();
		document.addEventListener("dblclick", function (e) {
			var selection = getSelectionText();
			if (selection.trim().length > 0) {
				fetchWordDefinition(selection);
				showPopup(e.clientX, e.clientY);
			}
		});

		document.addEventListener('click', closePopup);

	}

	function toggleMessage(flag) {
		popupRef.querySelector('.ff-dict-loading-message').style.display = (flag ? 'block' : 'none');
	}

	function clearPreviousMeanings() {
		popupRef.querySelectorAll('.ff-dict-word-meanings-ctr').forEach(function(meaningRef) {
			popupRef.removeChild(meaningRef);
		});
	}

	function fetchWordDefinition(word) {

		toggleMessage(true);
		clearPreviousMeanings();

		fetch(apiUrl + word, {method:'get', mode: 'no-cors' })
			.then(function (response) {
				return response.text();
			})
			.then(function (json) {
				console.log(json);
				// json = JSON.parse(json);
				if (json && json.length > 0) {
					json.forEach(function(meaningJson) {
						console.log(meaningJson);
						insertWordDetails(meaningJson.type, word, meaningJson.definition, meaningJson.example);
					});
				} else {
					insertWordDetails('', word, 'Sorry! Nothing found for :  "' + word );
				}

			}).catch(function (err) {
				toggleMessage(false);
				console.log("OOPS ! Mayday Mayday !!!");
				console.error(err);
				// insertWordDetails('oops!', 'There was a problem. Please send the error message in the console to ccscoder@gmail.com');
			});
	}

	function closePopup(e) {
		popupRef.style.display = 'none';
	}

	function insertWordDetails(type, word, definition, example) {

		var containerRef = renderMeaningPlaceholder();
		// debugger;
		containerRef.querySelector('.ff-dict-word').innerText = word;
		containerRef.querySelector('.ff-dict-word-type').innerText = (type && type.length) > 0 ? ('(' + type + ')') : '';
		containerRef.querySelector('.ff-dict-word-definition').innerText = definition;
		containerRef.querySelector('.ff-dict-word-example').innerText = (example || 'No Example Available...');

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

	function renderMeaningPlaceholder() {
		var newMeaningNodeRef = _createDomElement('<div class="ff-dict-word-meanings-ctr"><p class="ff-dict-word-definition" style="font-size:normal"></p>' +
			'<p style="color:grey">Example:</p>' +
			'<p class="ff-dict-word-example" class="font-size:normal"></p><p>&nbsp;</p></div>');
		
			
		popupRef.appendChild(newMeaningNodeRef);
		return newMeaningNodeRef;
		
	}

	function _createDomElement(htmlStr) {
		var tempElem = document.createElement('div');
		tempElem.innerHTML = htmlStr;
		return tempElem.firstChild;
	}

	function createPopup() {
		var tempElem = document.createElement('div');
		tempElem.innerHTML =
			'<div class="ff-dict-meaning-popupRef" style="position: absolute;padding: 10px;background: #EFF2B9;color: black;display: none;z-index:9999000;border-radius:5px;border: 1px solid yellow;">' +
			'<p class="ff-dict-word" style="font-weight:bold">' +
				'<span class="ff-dict-word-type" style="color:darkgrey"></span>:' +
			'</p>'+
			'<div class="ff-dict-loading-message">Looking up...</div>'+
			'</div>';

		var popup = tempElem.firstChild;
		document.querySelector("body").append(tempElem.firstChild);

		return popup;
	}

	function adjustPopup() {
		var dims = window.getComputedStyle(popupRef);
		var width = parseFloat(dims.width);
		var height = parseFloat(dims.height);
		var x = parseFloat(dims.left);
		var y = parseFloat(dims.top);

		popupRef.style.top = (y - (height + 35)) + 'px';
		popupRef.style.left = (x - (width / 2)) + 'px';
	}

	function showPopup(x, y) {
		popupRef.style.top = y + 'px';
		popupRef.style.left = x + 'px';
		popupRef.style.display = 'block';

		adjustPopup();

	}

	return {
		init: init
	}

})();


dictionary.init();
