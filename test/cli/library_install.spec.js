/*
 ******************************************************************************
 Copyright (c) 2016 Particle Industries, Inc.  All rights reserved.

 This program is free software; you can redistribute it and/or
 modify it under the terms of the GNU Lesser General Public
 License as published by the Free Software Foundation, either
 version 3 of the License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 Lesser General Public License for more details.

 You should have received a copy of the GNU Lesser General Public
 License along with this program; if not, see <http://www.gnu.org/licenses/>.
 ******************************************************************************
 */

import {expect} from '../test-setup';
const path = require('path');
import libraryInstall, {CLILibraryInstallCommandSite} from '../../src/cli/library_install';
import {LibraryInstallCommand} from '../../src/cmd';
import * as cli from '../../src/app/nested-yargs';

describe('library install command', () => {

	describe('site', () => {
		const sut = new CLILibraryInstallCommandSite({});
		it('can instantiate the site', () => {
			return expect(sut).to.be.ok;
		});
	});

	describe('command', () => {
		const sut = new LibraryInstallCommand();

		it('can instantiate the command', () => {
			return expect(sut).to.be.ok;
		});

	});

	describe('command line', () => {

		const lib = cli.createAppCategory();
		libraryInstall({lib, factory:cli});

		it('recognizes the install command', () => {
			const argv = lib.parse('install'.split(' '));
			expect(argv.clicommand).to.be.ok;
		});

		it('recognizes the install command with library', () => {
			const argv = lib.parse('install neopixel'.split(' '));
			expect(argv.clicommand).to.be.ok;
			expect(argv.params).to.be.deep.equal({name:'neopixel'});
		});

		it('recognizes the install vendored command', () => {
			const argv = lib.parse('install --vendored'.split(' '));
			expect(argv.clicommand).to.be.ok;
			expect(argv).to.have.property('vendored').that.is.true;
		});

		it('recognizes the install vendored command with confirmation', () => {
			const argv = lib.parse('install --vendored -y'.split(' '));
			expect(argv.clicommand).to.be.ok;
			expect(argv).to.have.property('vendored').that.is.true;
			expect(argv).to.have.property('confirm').that.is.true;
		});


		it('recognizes the install vendored command with library', () => {
			const argv = lib.parse('install neopixel --vendored'.split(' '));
			expect(argv.clicommand).to.be.ok;
			expect(argv).to.have.property('vendored').that.is.true;
			expect(argv.params).to.be.deep.equal({name:'neopixel'});
		});

		it('recognizes the install vendored command with library name at end', () => {
			const argv = lib.parse('install --vendored neopixel'.split(' '));
			expect(argv.clicommand).to.be.ok;
			expect(argv).to.have.property('vendored').that.is.true;
			expect(argv.params).to.be.deep.equal({name:'neopixel'});
		});

	})
});
