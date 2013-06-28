$(function() {

	Nowysiwyg.custom.whatever = function () {
		return 'whatever';
	}

	Nowysiwyg.buttons.z = function (el) {
		that.addTag('z', el);
	}

	Nowysiwyg.buttons.w = function (el) {
		alert(that.custom.whatever());
	}

	$('textarea').nowysiwyg({
		buttons: {
            'top': ['b', 'i'],
            'right': ['i', 'b'],
            'bottom': ['i','z','w'],
            'left': ['b','i','p']
        }
	});


});