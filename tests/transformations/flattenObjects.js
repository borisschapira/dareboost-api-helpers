const { expect } = require('chai');
const { flattenObject, flattenObjects } = require('../../lib/transformations');

describe('flattenObject', async () => {
	it('flattens a standard object', async () => {
		const source = {
			key_one: 'hello',
			key_two: { subkey_one: 'world', subkey_two: { x: 4 } },
			key_three: [{ key: 'the_key', value: 'the_value' }],
		};
		const target = {
			keyOne: 'hello',
			keyThree0Key: 'the_key',
			keyThree0Value: 'the_value',
			keyTwoSubkeyOne: 'world',
			keyTwoSubkeyTwoX: 4,
		};
		expect(target).to.deep.equal(flattenObject(source));
	});

	it('flattens a monitor config', async () => {
		const source = {
			id: 7134,
			url: 'https://boris.schapira.dev/',
			name: 'boris.schapira.dev',
			state: 'OK',
			lastExecution: 1565686301911,
			enabled: true,
			frequency: 1440,
			lang: 'fr',
			config: {
				location: 'Paris',
				browser: { name: 'Chrome' },
				isMobile: false,
				bandwidth: { upstream: 1500, downstream: 8000 },
				latency: 50,
				isPrivate: false,
				adblock: false,
				screen: { height: 768, width: 1366 },
				header: [
					{
						value:
							'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36 DareBoost',
						key: 'User-Agent',
					},
					{ value: 'cache', key: 'pragma' },
				],
				cookies: [
					{
						name: 'cname',
						value: 'cvalue',
						domain: 'boris.schapira.dev',
						path: '/',
					},
				],
				repeatedView: false,
				http2Disabled: false,
			},
		};
		const target = {
			id: 7134,
			url: 'https://boris.schapira.dev/',
			name: 'boris.schapira.dev',
			state: 'OK',
			lastExecution: '2019-08-13T08:51:41.911Z',
			enabled: true,
			frequency: 1440,
			lang: 'fr',
			configLocation: 'Paris',
			configBrowserName: 'Chrome',
			configIsMobile: false,
			configBandwidthUpstream: 1500,
			configBandwidthDownstream: 8000,
			configLatency: 50,
			configIsPrivate: false,
			configAdblock: false,
			configScreenHeight: 768,
			configScreenWidth: 1366,
			configHeaderUserAgent:
				'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36 DareBoost',
			configHeaderPragma: 'pragma: cache',
			configCookieCname: 'cname=cvalue; Path=/; Domain=boris.schapira.dev',
			configRepeatedView: false,
			configHttp2Disabled: false,
		};
		expect(target).to.deep.equal(flattenObject(source));
	});
});

describe('flattenObjects', async () => {
	it('flattens an array of objects', async () => {
		const source = {
			key_one: 'hello',
			key_two: { subkey_one: 'world', subkey_two: { x: 4 } },
			key_three: [{ key: 'the_key', value: 'the_value' }],
		};
		const target = {
			keyOne: 'hello',
			keyThree0Key: 'the_key',
			keyThree0Value: 'the_value',
			keyTwoSubkeyOne: 'world',
			keyTwoSubkeyTwoX: 4,
		};
		expect([target, target]).to.deep.equal(flattenObjects([source, source]));
	});
});
