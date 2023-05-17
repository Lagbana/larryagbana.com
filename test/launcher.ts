import { handler } from "../src/services/spaces/handler";

handler(
  {
    httpMethod: "GET",
    // headers: {
    //   Authorization:
    // },
  } as any,
  {} as any
).then((result) => {
  console.log(result);
});
