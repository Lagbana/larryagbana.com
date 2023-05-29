import { SNSEvent, Context } from "aws-lambda";
import { handler } from "./handler";

const snsEvent = {
  Records: [
    {
      Sns: {
        Message: "This is a test!",
      },
    },
  ],
} as SNSEvent;

const mockContext = {} as Context;

handler(snsEvent, mockContext);
