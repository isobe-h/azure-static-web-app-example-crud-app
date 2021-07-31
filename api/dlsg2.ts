import {
  DataLakeFileSystemClient,
  DataLakeServiceClient,
  ListPathsOptions,
  StorageSharedKeyCredential,
} from "@azure/storage-file-datalake";
import path from "path";
import { ParsedMultipartFormData } from "./helper/parseMultipart";
import { streamToString } from "./helper/streamToString";

export default class Dlsg2 {
  private readonly dataLakeServiceClient: DataLakeServiceClient;
  private readonly directory: string;
  readonly fileSystemClient: DataLakeFileSystemClient;
  constructor(
    storageName: string,
    storageKey: string,
    directory: string = "",
    containerName = "crud"
  ) {
    this.dataLakeServiceClient = new DataLakeServiceClient(
      `https://${storageName}.dfs.core.windows.net`,
      new StorageSharedKeyCredential(storageName, storageKey)
    );
    this.fileSystemClient =
      this.dataLakeServiceClient.getFileSystemClient(containerName);
    this.directory = directory;
  }

  download = async (filename: string) => {
    const fileContents = await this.fileSystemClient
      .getFileClient(path.join(this.directory, filename))
      .read();
    const str = await streamToString(fileContents.readableStreamBody);
    return str;
  };
  remove = async (fileName: string) => {
    const res = await this.fileSystemClient
      .getFileClient(path.join(this.directory, fileName))
      .deleteIfExists(true);
    return res.succeeded;
  };

  fetch = async () => {
    let res = [];
    const options: ListPathsOptions = { path: this.directory };
    for await (const listPath of this.fileSystemClient.listPaths(options)) {
      res.push({ name: listPath.name, size: listPath.contentLength });
    }
    return res;
  };

  upload = async (parsedData: ParsedMultipartFormData) => {
    const fileClient = this.fileSystemClient.getFileClient(
      path.join(this.directory, parsedData.filename)
    );
    await fileClient.create();
    await fileClient.append(parsedData.data, 0, parsedData.data.length);
    return await fileClient.flush(parsedData.data.length);
  };
}
