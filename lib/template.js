const AWS = require('aws-sdk');
const YAML = require('yaml');

module.exports = {
    awsGetTemplate(opts) {
        const CF = new AWS.CloudFormation({ apiVersion: '2010-05-15' });
        return CF.getTemplate({
            StackName: opts.stack,
        })
            .promise()
            .then(result => this.parseJSONorYAML(result.TemplateBody));
    },
    parseJSONorYAML(body) {
        if (body.match(/^\s*\{/)) {
            return JSON.parse(body.replace(/,(\s*[})\]])/g, '$1'));
        }
        else {
            return YAML.parseDocument(body.replace(/!(\w+)/g, "$1:"));
        }
    },
};
