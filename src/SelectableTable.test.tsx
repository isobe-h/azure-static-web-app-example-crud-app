import { render, screen } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import SelectableTable from "./SelectableTable";

const mock = new MockAdapter(axios);
beforeAll(() => {
  mock.onGet("/api/files").reply(200, [
    { name: "test1.txt", size: 1600 },
    { name: "test2.bin", size: 10 },
  ]);
});
test("should show file list", async () => {
  render(<SelectableTable />);
  expect(await screen.findByText("test1.txt")).toBeInTheDocument();
  expect(screen.getByText("test2.bin")).toBeInTheDocument();
});
