# MLB stats backend - CDK resources 

This repository uses the AWS CDK to define a REST API that interfaces with an Elasticsearch cluster. These API routes service the [MLB stats application](https://github.com/billycastelli/MLB-Stats-Frontend).

The [/lib/elastic-lambdas-stack.ts](lib/elastic-lambdas-stack.ts) file defines the AWS resources deployed to AWS. 

Lambda functions are defined in the `/src` folder.

## Routes

1. `GET /batting/<playerid>`

- Returns of a data dump of all batting stats associated with the `playerid`. 


2. `POST /search`

- Example payload (Page 1)
```
{
    "name_input": "Babe Ruth", 
    "result_size": 20,
    "starting_index": 0
}
```
