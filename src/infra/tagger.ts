import { IAspect } from "aws-cdk-lib";
import { RestApi } from "aws-cdk-lib/aws-apigateway";
import { CfnBucket } from "aws-cdk-lib/aws-s3";
import { IConstruct } from "constructs";

/**
 * An Aspect applies tags to the bucket
 * Follows a visitor pattern which represents an operation to be performed
 * on the elements of an object structure. Let's you define a new operation
 * without changing the classes of the elements on which it operates.
 */

export class BucketTagger implements IAspect {
  readonly #key: string;
  readonly #value: string;

  constructor(key: string, value: string) {
    this.#key = key;
    this.#value = value;
  }

  visit(node: IConstruct): void {
    if (node instanceof CfnBucket) {
      node.tags.setTag(this.#key, this.#value);
    }
  }
}
