import { HttpRequest } from "@azure/functions";
import Busboy from "busboy";

export type ParsedMultipartFormData = {
  filename: string;
  data: Buffer;
};

/**
 *
 * @param req Raw http request
 * @returns Parsed data when succeeded to parse.
 *					Error object when error occured. Make sure that the header is valid.
 */
export default function parseMultipart(
  req: HttpRequest
): Promise<ParsedMultipartFormData[]> {
  return new Promise((resolve) => {
    const files: ParsedMultipartFormData[] = [];
    const busboy = new Busboy({ headers: req.headers });
    busboy.on("file", (fieldname, file, filename) => {
      file.on("data", (data: Buffer) => {
        files.push({ filename, data });
      });
    });
    busboy.on("finish", () => {
      resolve(files);
    });
    busboy.end(req.rawBody);
  });
}
