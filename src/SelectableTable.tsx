import { useState, FC, useCallback, useEffect, useRef } from "react";
import { Button, ButtonGroup } from "@material-ui/core";
import {
  DataGrid,
  GridColumns,
  GridRowData,
  GridRowId,
} from "@material-ui/data-grid";
import axios from "axios";

type FileListResponse = {
  name: string;
  size: number;
};

const uploadFiles = async (files: File[]) => {
  const form = new FormData();
  files.forEach((file) => form.append("file", file, file.name));
  const res = await axios.post(`/api/storage`, form, {
    headers: { "content-type": "multipart/form-data" },
  });
  return res;
};
const downloadFile = async (selectedFileName: string) => {
  const res = await axios.get(`/api/storage/${selectedFileName}`);
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const elm = document.createElement("a");
  document.body.appendChild(elm);
  elm.href = url;
  elm.download = selectedFileName;
  elm.click();
  elm.remove();
  URL.revokeObjectURL(url);
};
const fetchFiles = async () => {
  const res = await axios.get<FileListResponse[]>("/api/storage");
  const contents: GridRowData[] = res.data.map((d, index) => {
    return { id: index, fileName: d.name, fileSize: d.size };
  });
  return contents;
};
const columns: GridColumns = [
  { field: "id", width: 90, headerName: "ID" },
  { field: "fileName", headerName: "ファイル名", width: 280 },
  { field: "fileSize", headerName: "サイズ", width: 140 },
];

const SelectableTable: FC = () => {
  const [selectedRowIds, setSelectedRowId] = useState<GridRowId[]>([]);
  const [selectedFileCount, setSelectedFileCount] = useState(0);
  const [rows, setRows] = useState<GridRowData[]>([]);
  const inputFile = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async function () {
      setRows(await fetchFiles());
    })();
  }, []);

  const onSelectionChange = useCallback((ids: GridRowId[]) => {
    setSelectedRowId(ids);
    setSelectedFileCount(ids.length);
  }, []);

  return (
    <div style={{ height: 650, width: "100%" }}>
      <ButtonGroup>
        <Button variant="contained" onClick={() => inputFile?.current?.click()}>
          <input
            type="file"
            multiple
            ref={inputFile}
            style={{ display: "none" }}
            onChange={async (e) => {
              if (e.currentTarget.files) {
                await uploadFiles(Array.from(e.currentTarget.files));
                setRows(await fetchFiles());
              }
            }}
          />
          アップロード
        </Button>
        <Button
          variant="contained"
          onClick={async () => {
            setRows(await fetchFiles());
          }}
        >
          更新
        </Button>
        <Button
          onClick={async () => {
            for await (const id of selectedRowIds) {
              await downloadFile(rows[id as number].fileName);
            }
          }}
          disabled={selectedFileCount < 1}
          variant="contained"
        >
          ダウンロード
        </Button>
        <Button
          disabled={selectedFileCount < 1}
          variant="contained"
          onClick={async () => {
            for await (const id of selectedRowIds) {
              await axios.delete(`/api/storage/${rows[id as number].fileName}`);
            }
            setRows(await fetchFiles());
          }}
        >
          削除
        </Button>
      </ButtonGroup>
      <DataGrid
        onSelectionModelChange={(ids) => onSelectionChange(ids)}
        rows={rows}
        columns={columns}
        pageSize={25}
        checkboxSelection
      />
    </div>
  );
};

export default SelectableTable;
