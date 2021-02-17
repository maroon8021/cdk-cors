import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apigw from "@aws-cdk/aws-apigateway";

export class CorsTestStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const code = `${__dirname}/../../backend/`;

    const lambdaFunction = new lambda.Function(this, "cors-test-lambda", {
      runtime: lambda.Runtime.NODEJS_12_X,
      functionName: "cors-test-lambda",
      code: lambda.Code.fromAsset(code),
      handler: "index.handler",
    });

    const api = new apigw.LambdaRestApi(this, "cors-test-lambda-api", {
      handler: lambdaFunction,
      options: {
        restApiName: "cors-test-lambda",
        defaultCorsPreflightOptions: {
          allowOrigins: ["*"],
          allowHeaders: ["content-type"],
          allowCredentials: true,
        },
        endpointTypes: [apigw.EndpointType.REGIONAL],
        binaryMediaTypes: ["*/*"],
      },
    });
  }
}
