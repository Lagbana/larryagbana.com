import { Duration, Stack } from "aws-cdk-lib";
import {
  Alarm,
  Unit,
  Metric,
  ComparisonOperator,
} from "aws-cdk-lib/aws-cloudwatch";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { Topic } from "aws-cdk-lib/aws-sns";
import { join } from "path";

import { type StackProps } from "aws-cdk-lib";
import { type Construct } from "constructs";
import { LambdaSubscription } from "aws-cdk-lib/aws-sns-subscriptions";
import { SnsAction } from "aws-cdk-lib/aws-cloudwatch-actions";

interface MonitoringStackProps extends StackProps {}

export class MonitoringStack extends Stack {
  constructor(scope: Construct, id: string, props?: MonitoringStackProps) {
    super(scope, id, props);

    const spacesApi4xxAlarm = new Alarm(this, "spaces4XXAlarm", {
      metric: new Metric({
        metricName: "4XXError",
        namespace: "AWS/ApiGateway",
        statistic: "Sum", // Sum the # of 4XX errors
        period: Duration.minutes(1), // events within a 1 minute window
        unit: Unit.COUNT, // # of 4XX errors
        dimensionsMap: {
          ApiName: "SpaceFinderApi",
        },
      }),
      evaluationPeriods: 1, // 1 minute
      threshold: 5, // # of 4XX errors per set period for trigger
      alarmName: "SpacesApi4XXAlarm",
    });

    const alarmWebHookLambda = new NodejsFunction(this, "alarmWebHookLambda", {
      runtime: Runtime.NODEJS_18_X,
      handler: "handler",
      entry: join(__dirname, "..", "monitoring", "handler.ts"),
    });

    const alarmTopic = new Topic(this, "AlarmTopic", {
      topicName: "AlarmTopic",
      displayName: "AlarmTopic",
    });

    // Publish alarm events (breaching and return-to-ok states) to SNS
    const topicAction = new SnsAction(alarmTopic);
    spacesApi4xxAlarm.addAlarmAction(topicAction);
    spacesApi4xxAlarm.addOkAction(topicAction);

    // Webhook lambda subscribes to alarm event
    alarmTopic.addSubscription(new LambdaSubscription(alarmWebHookLambda));
  }
}
