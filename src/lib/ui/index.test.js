const stream = require('stream');
const { expect, sinon } = require('../../../test/setup');
const UI = require('./index');


describe('UI', () => {
	const sandbox = sinon.createSandbox();
	let stdin, stdout, stderr, ui;

	beforeEach(() => {
		stdin = new stream.Readable();
		stdout = new stream.Writable({
			write: (chunk, encoding, callback) => {
				stdout.content = (stdout.content || '') + chunk;
				callback();
			}
		});
		stderr = new stream.Writable({
			write: (chunk, encoding, callback) => {
				stderr.content = (stderr.content || '') + chunk;
				callback();
			}
		});

		ui = new UI({ stdin, stdout, stderr });
		// disable colored output so testing across environments with varied
		// color level support is more predictable
		ui.chalk.enabled = false;
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('Writing to `stdout` and `stderr`', () => {
		it('Writes to `stdout`', () => {
			const msg = 'one two three';
			ui.write(msg);

			expect(stdout.content).to.equal(msg + ui.EOL);
		});

		it('Writes to `stderr`', () => {
			const msg = 'four five six';
			ui.error(msg);

			expect(stderr.content).to.equal(msg + ui.EOL);
		});
	});

	describe('Logging device details', () => {
		it('Logs details for a single device', () => {
			const [device] = getDetailedDeviceList();
			ui.logDeviceDetail(device);

			expect(stdout.content).to.equal([
				'test-photon [000000000e00000000000001] (Photon) is online',
				'  Variables:',
				'    name (string)',
				'    version (int32)',
				'    blinking (int32)',
				'  Functions:',
				'    int check (String args) ',
				'    int stop (String args) ',
				'    int start (String args) ',
				'    int toggle (String args) ',
				''
			].join(ui.EOL));
		});

		it('Logs details for a single device summary', () => {
			const [device] = getDeviceList();
			ui.logDeviceDetail(device);

			expect(stdout.content).to.equal([
				'test-photon [000000000e00000000000001] (Photon) is online',
				''
			].join(ui.EOL));
		});

		it('Logs details for multiple devices', () => {
			const devices = getDetailedDeviceList();
			ui.logDeviceDetail(devices);

			expect(stdout.content).to.equal([
				'test-photon [000000000e00000000000001] (Photon) is online',
				'  Variables:',
				'    name (string)',
				'    version (int32)',
				'    blinking (int32)',
				'  Functions:',
				'    int check (String args) ',
				'    int stop (String args) ',
				'    int start (String args) ',
				'    int toggle (String args) ',
				'test-boron [e00fce0000f0c0a00c00e00a] (Boron) is online',
				'  Functions:',
				'    int start (String args) ',
				'    int stop (String args) ',
				'test-argon [e00fce00000e0df000f0000c] (Argon) is online',
				'  Functions:',
				'    int start (String args) ',
				'    int stop (String args) ',
				''
			].join(ui.EOL));
		});

		it('Logs details for multiple device summaries', () => {
			const devices = getDeviceList();
			ui.logDeviceDetail(devices);

			expect(stdout.content).to.equal([
				'test-photon [000000000e00000000000001] (Photon) is online',
				'test-boron [e00fce0000f0c0a00c00e00a] (Boron) is online',
				'test-argon [e00fce00000e0df000f0000c] (Argon) is online',
				''
			].join(ui.EOL));
		});
	});

	function getDeviceList(){
		return [
			{
				id: '000000000e00000000000001',
				name: 'test-photon',
				last_app: null,
				last_ip_address: '192.0.2.0',
				last_heard: '2020-01-20T02:53:29.854Z',
				product_id: 6,
				connected: true,
				platform_id: 6,
				cellular: false,
				notes: 'test photon notes',
				status: 'normal',
				serial_number: 'XXXX-000000-0X0X-0',
				current_build_target: '1.4.4',
				system_firmware_version: '1.4.4',
				default_build_target: '1.4.4'
			},
			{
				id: 'e00fce0000f0c0a00c00e00a',
				name: 'test-boron',
				last_app: null,
				last_ip_address: '192.0.2.1',
				last_heard: '2020-01-19T22:44:53.444Z',
				product_id: 13,
				connected: true,
				platform_id: 13,
				cellular: true,
				notes: 'test boron notes',
				status: 'normal',
				serial_number: 'X00XXX000XXXXXX',
				iccid: '89011700000000000000',
				last_iccid: '89011700000000000000',
				imei: '000000000000000',
				mobile_secret: '0X0XXX0XX0X0XXX',
				current_build_target: '1.4.4',
				system_firmware_version: '1.4.4',
				default_build_target: '1.4.4'
			},
			{
				id: 'e00fce00000e0df000f0000c',
				name: 'test-argon',
				last_app: null,
				last_ip_address: '192.0.2.2',
				last_heard: '2020-01-18T00:29:30.269Z',
				product_id: 12,
				connected: true,
				platform_id: 12,
				cellular: false,
				notes: null,
				status: 'normal',
				serial_number: 'XXXXXX000XXX0X0',
				mobile_secret: 'X0XXXXXXXXXXXXX',
				current_build_target: '1.4.4',
				system_firmware_version: '1.4.4',
				default_build_target: '1.4.4'
			}
		];
	}

	function getDetailedDeviceList(){
		return [
			{
				id: '000000000e00000000000001',
				name: 'test-photon',
				last_app: null,
				last_ip_address: '192.0.2.0',
				last_heard: '2020-01-20T02:53:29.854Z',
				product_id: 6,
				connected: true,
				platform_id: 6,
				cellular: false,
				notes: 'test photon notes',
				status: 'normal',
				serial_number: 'XXXX-000000-0X0X-0',
				current_build_target: '1.4.4',
				system_firmware_version: '1.4.4',
				default_build_target: '1.4.4',
				variables: {
					name: 'string',
					version: 'int32',
					blinking: 'int32'
				},
				functions: [
					'check',
					'stop',
					'start',
					'toggle'
				],
				firmware_updates_enabled: true,
				firmware_updates_forced: false
			},
			{
				id: 'e00fce0000f0c0a00c00e00a',
				name: 'test-boron',
				last_app: null,
				last_ip_address: '192.0.2.1',
				last_heard: '2020-01-19T22:44:53.444Z',
				product_id: 13,
				connected: true,
				platform_id: 13,
				cellular: true,
				notes: 'test boron notes',
				network: {
					id: '0xx0x000xxx0xx0000x00000',
					name: 'test-mesh-network',
					type: 'micro_wifi',
					role: {
						gateway: true,
						state: 'confirmed'
					}
				},
				status: 'normal',
				serial_number: 'X00XXX000XXXXXX',
				iccid: '89011700000000000000',
				last_iccid: '89011700000000000000',
				imei: '000000000000000',
				mobile_secret: '0X0XXX0XX0X0XXX',
				current_build_target: '1.4.4',
				system_firmware_version: '1.4.4',
				default_build_target: '1.4.4',
				variables: {},
				functions: [
					'start',
					'stop'
				],
				firmware_updates_enabled: true,
				firmware_updates_forced: false
			},
			{
				id: 'e00fce00000e0df000f0000c',
				name: 'test-argon',
				last_app: null,
				last_ip_address: '192.0.2.2',
				last_heard: '2020-01-18T00:29:30.269Z',
				product_id: 12,
				connected: true,
				platform_id: 12,
				cellular: false,
				notes: null,
				network: {
					id: '0xx0x000xxx0xx0000x00000',
					name: 'test-mesh-network',
					type: 'micro_wifi',
					role: {
						gateway: false,
						state: 'pending'
					}
				},
				status: 'normal',
				serial_number: 'XXXXXX000XXX0X0',
				mobile_secret: 'X0XXXXXXXXXXXXX',
				current_build_target: '1.4.4',
				system_firmware_version: '1.4.4',
				default_build_target: '1.4.4',
				variables: {},
				functions: [
					'start',
					'stop'
				],
				firmware_updates_enabled: true,
				firmware_updates_forced: false
			}
		];
	}
});