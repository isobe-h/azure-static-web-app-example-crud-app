import path from "path";
import Dlsg2 from "../dlsg2";
import { ParsedMultipartFormData } from "../helper/parseMultipart";
import { streamToString } from "../helper/streamToString";

let dlsg2: Dlsg2;
const initialData = "buffer";
const testDirectoryName = "test";
const multipartData1: ParsedMultipartFormData = {
  filename: "test.bin",
  data: Buffer.from(initialData),
};
const filePath = path.join(testDirectoryName, multipartData1.filename);

require("dotenv").config();

describe("DataLakeStorageGen2", () => {
  beforeAll(async () => {
    try {
      dlsg2 = new Dlsg2(
        process.env.STORAGE_ACCOUNT_NAME,
        process.env.STORAGE_KEY,
        testDirectoryName
      );
      await dlsg2.remove(multipartData1.filename);
      expect(
        await dlsg2.fileSystemClient
          .getFileClient(path.join(testDirectoryName, multipartData1.filename))
          .exists()
      ).toBeFalsy();
      await dlsg2.fileSystemClient
        .getDirectoryClient(testDirectoryName)
        .createIfNotExists();
    } catch (error) {
      throw new Error(error);
    }
  });

  it("ファイルがアップロードできる", async () => {
    try {
      await dlsg2.upload(multipartData1);
      expect(true).toBeTruthy();
    } catch (error) {
      throw new Error(error);
    }
  });
  it("同名のファイルがあった場合はアップロードしない", async () => {
    multipartData1.data = Buffer.from(initialData);
    try {
      await dlsg2.upload(multipartData1);
      const fileClient = dlsg2.fileSystemClient.getFileClient(filePath);
      fileClient.createIfNotExists();
      const downloadResponse = await fileClient.read();
      expect(await streamToString(downloadResponse.readableStreamBody)).toBe(
        initialData
      );
    } catch (error) {
      throw new Error(error);
    }
  });
  it("ファイルをダウンロードできる", async () => {
    try {
      const content = await dlsg2.download(multipartData1.filename);
      expect(content).toBe(initialData);
    } catch (error) {
      throw new Error(error);
    }
  });
  it("ファイル一覧を取得できる", async () => {
    try {
      const files = await dlsg2.fetch();
      expect(files.length).toBe(1);
      expect(files[0].name.split("/")[1]).toBe(multipartData1.filename);
      expect(files[0].size).toBe(multipartData1.data.length);
    } catch (error) {
      throw new Error(error);
    }
  });
  it("ファイルを削除できる", async () => {
    try {
      expect(await dlsg2.remove(multipartData1.filename)).toBeTruthy();
    } catch (error) {
      throw new Error(error);
    }
  });
  afterAll(async () => {
    await dlsg2.remove(multipartData1.filename);
  });
});
