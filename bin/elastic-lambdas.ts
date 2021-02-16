#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { ElasticLambdasStack } from "../lib/elastic-lambdas-stack";

const app = new cdk.App();
new ElasticLambdasStack(app, "ElasticLambdasStack", {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
    },
});