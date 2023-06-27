import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { handler } from "../../src/controller/handler";
import { CoreService } from "../../src/core/shortner";

// Create a type for the mocked version of CoreService.
type MockedCoreService = typeof CoreService & { mock: any };

jest.mock("../../src/core/shortner", () => {
  return {
    CoreService: jest.fn().mockImplementation(function () {
      this.getOriginalUrl = jest.fn();
      this.createShortenedUrl = jest.fn();
      return {
        getOriginalUrl: this.getOriginalUrl,
        createShortenedUrl: this.createShortenedUrl,
      };
    }),
  };
});

describe("handler", () => {
  let MockedServiceInstance: MockedCoreService;

  beforeEach(() => {
    MockedServiceInstance = CoreService as unknown as MockedCoreService;
  });

  it("returns original URL for GET request", async () => {
    const pathParameter: {
      [name: string]: string | undefined;
    } = {
      urlId: "someUrlId",
    };
    const mockEvent = {
      httpMethod: "GET",
      pathParameters: pathParameter,
    } as APIGatewayProxyEvent;

    const mockContext = {} as Context;

    // Assume that getOriginalUrl will resolve to this result
    const getOriginalUrlResult: APIGatewayProxyResult = {
      statusCode: 200,
      body: "http://example.com",
    };

    MockedServiceInstance.mock.instances[0].getOriginalUrl.mockResolvedValue(
      getOriginalUrlResult
    );
    const result = await handler(mockEvent, mockContext);

    expect(
      MockedServiceInstance.mock.instances[0].getOriginalUrl
    ).toHaveBeenCalledWith("someUrlId");

    expect(result).toEqual({
      statusCode: 200,
      body: "http://example.com",
    });
  });

  it("creates a new shortened URL for POST request", async () => {
    const mockEvent = {
      httpMethod: "POST",
      body: JSON.stringify({ url: "http://example.com" }),
    } as APIGatewayProxyEvent;

    const mockContext = {
      awsRequestId: "mock-request-id",
    } as Context;

    const expectedResult: APIGatewayProxyResult = {
      statusCode: 201,
      body: JSON.stringify({ shortenedUrl: "http://shrt.com" }),
    };

    MockedServiceInstance.mock.instances[0].createShortenedUrl.mockResolvedValue(
      expectedResult
    );

    const result = await handler(mockEvent, mockContext);

    expect(
      MockedServiceInstance.mock.instances[0].createShortenedUrl
    ).toHaveBeenCalledWith("http://example.com", "mock-request-id");
    expect(result).toEqual(expectedResult);
  });

  it("returns 400 error for invalid URL in POST request", async () => {
    const mockEvent = {
      httpMethod: "POST",
      body: JSON.stringify({ url: "not a valid url" }),
    } as APIGatewayProxyEvent;

    const mockContext = {} as Context;

    const result = await handler(mockEvent, mockContext);

    expect(result).toEqual({
      statusCode: 400,
      body: "Bad request: Invalid URL.",
    });
  });

  it("returns 500 error for unhandled exception", async () => {
    const pathParameter: {
      [name: string]: string | undefined;
    } = {
      urlId: "someUrlId",
    };
    const mockEvent = {
      httpMethod: "GET",
      pathParameters: pathParameter,
    } as APIGatewayProxyEvent;

    const mockContext = {} as Context;

    const error = new Error("Something went wrong");
    MockedServiceInstance.mock.instances[0].getOriginalUrl.mockRejectedValue(
      error
    );

    const result = await handler(mockEvent, mockContext);

    expect(result).toEqual({
      statusCode: 500,
      body: JSON.stringify(error.message),
    });
  });
});
