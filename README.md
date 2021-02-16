# MLB stats backend - CDK resources 

This repository uses the AWS CDK to define a REST API that interfaces with an Elasticsearch cluster. These API routes service the [MLB stats application](https://github.com/billycastelli/MLB-Stats-Frontend).

The [/lib/elastic-lambdas-stack.ts](lib/elastic-lambdas-stack.ts) file defines the AWS resources deployed to AWS. 

Lambda functions are defined in the `/src` folder.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
 
 Note: When changes are made to the stack definition, run `npm run build` prior to `cdk deploy`. 
