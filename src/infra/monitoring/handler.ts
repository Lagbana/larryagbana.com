import { SNSEvent, Context } from "aws-lambda";
import { makeAlarmMessage } from "./util";

const webHookUrl =
  "https://hooks.slack.com/services/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";

async function handler(event: SNSEvent, context: Context) {
  for (const record of event.Records) {
    const message = makeAlarmMessage(record.Sns.Message);

    await fetch(webHookUrl, {
      method: "POST",
      body: JSON.stringify({
        text: `=============================
            ${message.AlarmName} 
        =============================
        Current state: ${message.NewStateValue}
        Reason: ${message.NewStateReason}
        Incident time: ${message.StateChangeTime}
        Affected component: ${message.Trigger.Namespace}
        Trigger point: ${message.Trigger.Threshold} errors / ${message.Trigger.EvaluationPeriods} minute
        `,
      }),
    });
  }
}

export { handler };
