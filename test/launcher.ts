import { handler } from "../src/controllers/spaces/handler";

handler(
  {
    httpMethod: "PUT",
    headers: {
      Authorization:
        "eyJraWQiOiI1SWo4THI5b2NMODUxYVNJSjJVNnZlQ1FUdkQ0RlM4VmZRMFVcL0VFcTFTOD0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI4ZmMwNmZhYS01NGU0LTQzODItYjhmMS05YjM3YWJjNWM2NDMiLCJjb2duaXRvOmdyb3VwcyI6WyJhZG1pbnMiXSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfbXkyeHhacWFHIiwiY29nbml0bzp1c2VybmFtZSI6InRlc3RlcjEiLCJvcmlnaW5fanRpIjoiYmY2ODMxYWQtZTYwNi00NmIzLTlkYTItMDIwYjRmZjAxN2VhIiwiY29nbml0bzpyb2xlcyI6WyJhcm46YXdzOmlhbTo6MTU4MjQ2NzcyNTU4OnJvbGVcL0F1dGhTdGFjay1Db2duaXRvQWRtaW5Sb2xlNEMxMEZCQTQtMThFUlY4M0lSM1UwVSJdLCJhdWQiOiI2MWpkN2k3NHVvbDYxNWN0MnNnZGJ0NHIyIiwiZXZlbnRfaWQiOiJhZTVhMTU4Yy05ZjY1LTQyNGEtYmExZC1kMzkwNjQ0MTBiM2QiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTY4NTE5OTgzMiwiZXhwIjoxNjg1MjAzNDMyLCJpYXQiOjE2ODUxOTk4MzIsImp0aSI6IjQ3YzIzOTVlLTc0NzUtNGU2YS1iMzM5LTZmZTM4YWMwMGY4OCIsImVtYWlsIjoibGFycnlhZ2JhbmFAZ21haWwuY29tIn0.nzczRqYCo7RBs7ig0DGT5IptpyqCmTlXCuWJvpF3g98iLcv2PZ_gi_D9GoyRIhG0ef8iBvqXovLeBbrO0VZcPp1QSpWFWAhs2BGbfZej_gnYrjWMMAkrRXRXrSsQ7CaaaGaC3G2Uuv4m-qZQBLRvl1W-TC0SjVUIpbBD-974yit2WGQ2ePZLdoyIi9tIahucguxHs2ponLtjNroUGjYLuvP4aVsZQJDw9Z47XaOujUbQXaqFAkPHHnNm7PbVQmlhBw6jsBSnT_xQxWcqF154Jq24yKYDotND7tkXJy4iKOMDabRtuvqroHHZsaJTmAI1B15o2K0fNm6QLY5loElHWQ",
    },
    queryStringParameters: {
      id: "15823399-42c7-4862-9950-f2f9cb18466b",
    },
    body: `{"location":"Oslo","id":"15823399-42c7-4862-9950-f2f9cb18466b","name": "blue-updated2","photoUrl":"https://space-photos-bucket-0e03cf9d7dff.s3.us-east-1.amazonaws.com/opengraph-preview.png"}`,
  } as any,
  {} as any
).then((result) => {
  console.log(result);
});
