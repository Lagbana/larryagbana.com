# URL Shortener

This is a url shortner service that takes in a valid URL and returns a shortned URL in the form `https://t.ink/xxxxxx`.

## Dependencies

This service relies on the following:

- AWS Constructs:
  - API Gateway: `handle requests`
  - Lambda: `run the shortner logic`
  - DynamoDB: `persist URL info`
- React.js: `web client`
