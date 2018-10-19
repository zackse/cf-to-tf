#!/usr/bin/env node

const program = require('commander');
const awsGetStack = require('./lib/stack');
const template = require('./lib/template');
const configuration = require('./lib/configuration');
const state = require('./lib/state');
const cleanHCL = require('./lib/cleanHCL');
const getStdin = require('get-stdin');

const formatOptions = opts => {
	return {
		stack: opts.parent.stack,
		resourceName: opts.parent.resourceName || 'main',
	};
};

const getStack = opts => {
	return getStdin().then(result => stdinOrGetStack(result, opts));
};

const stdinOrGetStack = (result, opts) => {
	if (result !== '' && opts.stack === '-') {
		return JSON.parse(result);
	}
	return awsGetStack(opts);
};

const handleError = err => {
	console.log(err);
	process.exit(1);
};

program.option('-s, --stack <stack>', 'The CloudFormation stack to import');
program.option(
	'-r, --resource-name <resourceName>',
	'The name to assign the terraform resource'
);

program
	.command('config')
	.description('Generates Terraform configuration in JSON')
	.action(options => {
		const opts = formatOptions(options);
		return getStack(opts)
			.then(result => {
				return configuration.generate(opts, result.Stacks[0]);
			})
			.then(result => console.log(JSON.stringify(result)))
			.catch(err => handleError(err));
		return getStack(opts)
			.then(result => {
				return configuration.generate(opts, result.Stacks[0]);
			})
			.then(result => console.log(JSON.stringify(result)))
			.catch(err => handleError(err));
	});

program
	.command('state')
	.description('Generates Terraform state file in JSON')
	.action(options => {
		const opts = formatOptions(options);
		return getStack(opts)
			.then(result => {
				return state.generate(opts, result.Stacks[0]);
			})
			.then(result => console.log(JSON.stringify(result)))
			.catch(err => handleError(err));
	});

program
	.command('template')
	.description('Prints the CloudFormation Stack Template')
	.action(options => {
		const opts = formatOptions(options);
		return template.awsGetTemplate(opts)
			.then(result => console.log(JSON.stringify(result)))
			.catch(err => handleError(err));
	});

program
	.command('clean-hcl')
	.description('Cleans generated HCL according to my preferences')
	.action(options => {
		const opts = formatOptions(options);
		return getStdin()
			.then(str => cleanHCL.clean(opts, str))
			.then(result => console.log(result))
			.catch(err => handleError(err));
	});

program.parse(process.argv);

// TODO mark required arguments
