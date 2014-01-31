define(function(require) {

	var Adapt = require('coreJS/adapt');
	var Backbone = require('backbone');

	Adapt.on('router:page', function() {
		console.log('page level should start now');
	});

});