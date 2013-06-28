$(function() {

	// Nowysiwyg.defaults.message = 'Goodbye World!';

	Nowysiwyg.buttons.z = function (el) {
		that.addTag('z', el);
	}

	$('textarea').nowysiwyg({
		// buttons: {
  //           'top': ['b', 'i'],
  //           'right': ['i', 'b'],
  //           'bottom': ['i','z','u'],
  //           'left': ['b','i','p']
  //       }
	});


});