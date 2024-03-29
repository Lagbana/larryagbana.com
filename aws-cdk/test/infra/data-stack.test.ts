import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { DataStack } from "../../src/infra/stacks/data-stack";

describe("DataStack", () => {
  let assert: Template;

  beforeAll(() => {
    const testApp = new App({
      outdir: "cdk.out",
    });
    const mockDataStack = new DataStack(testApp, "MockDataStack", {
      tableNamePrefix: "mock-table-prefix",
    });
    assert = Template.fromStack(mockDataStack);
  });

  test("dynamodb table was created", () => {
    assert.resourceCountIs("AWS::DynamoDB::Table", 1);
  });
});
