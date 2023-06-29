import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { handler } from "../../src/controller/handler";
import { CoreService } from "../../src/core/shortner";
import { responseWithCorsHeaders } from "../../src/controller/util";
import * as config from "../../src/config";

// Create a type for the mocked version of CoreService.
type MockedCoreService = typeof CoreService & { mock: any };

jest.mock("../../src/config");

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
    (config.getEnvVar as jest.Mock).mockReturnValue("https://www.xhitdev.com");
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
      headers: {
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": "https://www.xhitdev.com",
      },
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
      body: "{shortenedUrl:http://shrt.com}",
      headers: {
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": "https://www.xhitdev.com",
      },
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
      headers: {
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": "https://www.xhitdev.com",
      },
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

    const error = new Error("Something went wrong!");
    MockedServiceInstance.mock.instances[0].getOriginalUrl.mockRejectedValue(
      error
    );

    const result = await handler(mockEvent, mockContext);

    expect(result).toEqual({
      statusCode: 500,
      body: "Something went wrong!",
      headers: {
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": "https://www.xhitdev.com",
      },
    });
  });

  it("returns 405 error for unsupported HTTP method", async () => {
    const mockEvent = {
      httpMethod: "PUT",
      body: JSON.stringify({ url: "http://example.com" }),
    } as APIGatewayProxyEvent;

    const mockContext = {} as Context;

    const result = await handler(mockEvent, mockContext);

    expect(result).toEqual({
      statusCode: 405,
      body: "Method not allowed",
      headers: {
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": "https://www.xhitdev.com",
      },
    });
  });

  it("doesn't add CORS headers to 301 redirects", () => {
    const response: APIGatewayProxyResult = {
      statusCode: 301,
      headers: {
        Location: "https://redirect.to",
      },
      body: "",
    };

    const result = responseWithCorsHeaders(response, "www.example.com");

    expect(result.headers["Access-Control-Allow-Origin"]).toBeUndefined();
    expect(result.headers["Access-Control-Allow-Credentials"]).toBeUndefined();
  });
});
