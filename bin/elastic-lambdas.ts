#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { ElasticLambdasStack } from '../lib/elastic-lambdas-stack';

const app = new cdk.App();
new ElasticLambdasStack(app, 'ElasticLambdasStack');
