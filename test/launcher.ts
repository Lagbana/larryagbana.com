import { handler } from "../src/services/spaces/handler";

handler(
  {
    httpMethod: "POST",
    body: JSON.stringify({
      location: "Kanata updated",
    }),
  } as any,
  {} as any
).then((result) => {
  console.log(result);
});
