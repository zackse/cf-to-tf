const template = require('./../lib/template');
const AWS = require('aws-sdk-mock');

describe('', () => {
	test('handle_yaml_response', () => {
		AWS.mock('CloudFormation', 'getTemplate', {
			TemplateBody: "mocked: true\nyaml: is_OK",
		});
		const expected = {"mocked": true, "yaml": "is_OK"};
		return template.awsGetTemplate({}).then(result => {
			expect(result).toEqual(expected);
		});
	});
});
