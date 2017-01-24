
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

import {expect, sinon} from '../test-setup';
import {LibraryAddCommand, LibraryAddCommandSite} from "../../src/cmd";
import settings from "../../settings";
import {it_has_access_token, fetch_access_token} from './access_token';
const path = require('path');
import createLibraryCommand from '../../src/cli/library';
import * as factory from '../../src/app/nested-yargs';
import { resourcesDir } from 'particle-library-manager';
import ParticleApi from '../../src/cmd/api';

describe('library', () => {

	before(()=> {
		settings.whichProfile();
		settings.loadOverrides();
	});

	const libraryDir = path.join(resourcesDir(), 'libraries');
	const root = factory.createAppCategory();
	createLibraryCommand({root, factory});

	describe('migrate', () => {
		it('supports --dryrun flag', () => {
			const argv = factory.parse(root, ['library', 'migrate', '--dryrun']);
			expect(argv).to.have.property('dryrun').equal(true);
			expect(argv).to.have.property('clicommand');
		});

		it('can execute --test flag', () => {
			const argv = factory.parse(root, ['library', 'migrate', '--dryrun', path.join(libraryDir, 'libraries-v1')]);
			return argv.clicommand.exec(argv);
		});
	});

	describe('add', () => {
		it('populates the library name', () => {
			const argv = factory.parse(root, ['library', 'add', 'assettracker']);
			expect(argv.params).to.have.property('name').equal('assettracker');
		});

		it('requires the library name', () => {
			const argv = factory.parse(root, ['library', 'add']);
			const expectedError = factory.errors.requiredParameterError('name');
			expect(argv.clierror).to.eql(expectedError);
		});

		it_has_access_token('can fetch a list of libraries with a filter', () => {
			// todo - I copied this from the libraryAdd command - why do we need to specify access token twice? --mdma
			const apiJS = new ParticleApi(settings.apiUrl, {
				accessToken: fetch_access_token()
			}).api;

			const apiClient = apiJS.client({ auth: settings.access_token });
			const sut = new LibraryAddCommand({apiClient});
			const site = new LibraryAddCommandSite();
			site.notifyListLibrariesStart = sinon.spy(site.notifyListLibrariesStart);
			site.notifyListLibrariesComplete = sinon.spy(site.notifyListLibrariesComplete);

			return sut.listLibraries(site, 'neo').then(result => {
				expect(Array.isArray(result)).to.be.true;

				const names = result.map( (item) => {
					expect(item).has.property('name');
					return item.name;
				} );

				expect(names).to.include('neopixel');
				expect(site.notifyListLibrariesStart).to.be.calledOnce;
				expect(site.notifyListLibrariesComplete).to.be.calledOnce;
			});
		});

		it('adds a library to an existing project', () => {
			// TODO!
		})
	});


	// todo - exit codes for the command? or command response.

});
