import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import Dlsg2 from "../dlsg2";
import parseMultipart from "../helper/parseMultipart";

const storage: AzureFunction = async (
  context: Context,
  req: HttpRequest
): Promise<any> => {
  const dlsg2 = new Dlsg2(
    process.env.STORAGE_ACCOUNT_NAME,
    process.env.STORAGE_KEY
  );
  if (req.method === "POST") {
    const parsedData = await parseMultipart(req);
    for await (const data of parsedData) await dlsg2.upload(data);
    context.res = { status: 201 };
  } else if (req.method === "GET") {
    if (req.params.filename) {
      const res = await dlsg2.download(req.params.filename);
      context.res = { status: 200, body: res };
    }
    const res = await dlsg2.fetch();
    context.res = { status: 200, body: res };
  } else if (req.method === "DELETE") {
    const res = await dlsg2.remove(req.params.filename);
    context.res = { status: 204, body: res };
  } else context.res = { status: 405 };
};

export default storage;
