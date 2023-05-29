interface Trigger {
  MetricName: string;
  Namespace: string;
  EvaluationPeriods: number;
  Threshold: number;
}

interface SlackAlarm {
  AlarmName: string;
  NewStateValue: string;
  NewStateReason: string;
  StateChangeTime: string;
  OldStateValue: string;
  Trigger: Trigger;
}

export function makeAlarmMessage(object: string) {
  const alarm = JSON.parse(object);
  const alarmMessage: SlackAlarm = {
    AlarmName: alarm.AlarmName,
    NewStateValue: alarm.NewStateValue,
    NewStateReason: alarm.NewStateReason,
    StateChangeTime: alarm.StateChangeTime,
    OldStateValue: alarm.OldStateValue,
    Trigger: {
      MetricName: alarm.Trigger.MetricName,
      Namespace: alarm.Trigger.Namespace,
      EvaluationPeriods: alarm.Trigger.EvaluationPeriods,
      Threshold: alarm.Trigger.Threshold,
    },
  };

  return alarmMessage;
}
