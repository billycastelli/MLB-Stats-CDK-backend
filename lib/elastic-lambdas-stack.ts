import * as cdk from "@aws-cdk/core";
import * as ssm from "@aws-cdk/aws-ssm";
import lambda = require("@aws-cdk/aws-lambda");
import apigateway = require("@aws-cdk/aws-apigateway");

export class ElasticLambdasStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Create a lambda function, associate with js file
        const getBattingStats = new lambda.Function(this, "getBattingStatsLambda", {
            code: new lambda.AssetCode("src"),
            handler: "battingStats.getBattingStats",
            runtime: lambda.Runtime.NODEJS_12_X,
            timeout: cdk.Duration.seconds(100),
            environment: {
                ELASTIC_IP: ssm.StringParameter.valueFromLookup(this, "ELASTIC_BASEBALL_IP"),
                ELASTIC_USERNAME: ssm.StringParameter.valueFromLookup(this, "ELASTIC_BASEBALL_USERNAME"),
                ELASTIC_PASSWORD: ssm.StringParameter.valueFromLookup(this, "ELASTIC_BASEBALL_PASSWORD"),
            },
        });
        
        // Create a lambda function, associate with js file
        const searchPlayers = new lambda.Function(this, "searchPlayers", {
            code: new lambda.AssetCode("src"),
            handler: "search.searchPlayers",
            runtime: lambda.Runtime.NODEJS_12_X,
            timeout: cdk.Duration.seconds(100),
            environment: {
                ELASTIC_IP: ssm.StringParameter.valueFromLookup(this, "ELASTIC_BASEBALL_IP"),
                ELASTIC_USERNAME: ssm.StringParameter.valueFromLookup(this, "ELASTIC_BASEBALL_USERNAME"),
                ELASTIC_PASSWORD: ssm.StringParameter.valueFromLookup(this, "ELASTIC_BASEBALL_PASSWORD"),
            },
        });        

        // Create API Gateway resource
        const api = new apigateway.RestApi(this, "baseballAPI", {
            restApiName: "Baseball Stats REST API",
        });
        
        // Set up /batting endpoint
        const batting = api.root.addResource("batting");
        const getBatting = batting.addResource("{playerId}");
        
        // Set up /search endpoint
        const search = api.root.addResource("search");
    
        // Set up apiGateway/lambda integrations
        const getBattingIntegration = new apigateway.LambdaIntegration(getBattingStats);
        const searchPlayersIntegration = new apigateway.LambdaIntegration(searchPlayers);

        // Associate each integration with HTTP verb
        getBatting.addMethod("GET", getBattingIntegration);
        search.addMethod("POST", searchPlayersIntegration);

    }
}

export function addCorsOptions(apiResource: apigateway.IResource) {
    apiResource.addMethod(
        "OPTIONS",
        new apigateway.MockIntegration({
            integrationResponses: [
                {
                    statusCode: "200",
                    responseParameters: {
                        "method.response.header.Access-Control-Allow-Headers":
                            "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
                        "method.response.header.Access-Control-Allow-Origin":
                            "'*'",
                        "method.response.header.Access-Control-Allow-Credentials":
                            "'false'",
                        "method.response.header.Access-Control-Allow-Methods":
                            "'OPTIONS,GET,PUT,POST,DELETE'",
                    },
                },
            ],
            passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
            requestTemplates: {
                "application/json": '{"statusCode": 200}',
            },
        }),
        {
            methodResponses: [
                {
                    statusCode: "200",
                    responseParameters: {
                        "method.response.header.Access-Control-Allow-Headers": true,
                        "method.response.header.Access-Control-Allow-Methods": true,
                        "method.response.header.Access-Control-Allow-Credentials": true,
                        "method.response.header.Access-Control-Allow-Origin": true,
                    },
                },
            ],
        }
    );
}