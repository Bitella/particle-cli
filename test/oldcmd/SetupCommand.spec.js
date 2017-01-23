'use strict';

var Spinner = require('./../mocks/Spinner.mock.js');
var Interpreter = require('../../oldlib/interpreter');
var proxyquire = require('proxyquire');
var ApiClient2 = require('../../oldlib/ApiClient2');
var ApiClient = require('../../oldlib/ApiClient');

require('should');

var SetupCommand = proxyquire('../../commands/SetupCommand', {
	'cli-spinner': Spinner
});

describe('Setup Command', function() {

	var cli;
	var setup;

	before(function() {

		cli = new Interpreter();
		cli.startup();

		setup = new SetupCommand(cli);
	});

	it('Creates API Clients', function() {

		setup.__api.should.be.instanceOf(ApiClient2);
		setup.__oldapi.should.be.instanceOf(ApiClient);

	});
});
