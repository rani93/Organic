import React, { useEffect, useState } from "react";
import { DataTable, DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { Checkbox } from "primereact/checkbox";
import { fetchArtworks } from "../services/apiService";
// import { DataTableSelectionChangeEvent } from "primereact/datatable";

import 'primeicons/primeicons.css';
        


interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

const DataTableComponent: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(0);

  // State to track row selections persistently
  const [selectedRows, setSelectedRows] = useState<Record<number, boolean>>({});

  useEffect(() => {
    loadData(page);
  }, [page]);

  // Load Data for the current page
  const loadData = async (pageNumber: number) => {
    setLoading(true);
    const data = await fetchArtworks(pageNumber);
    setArtworks(data.data);
    setTotalRecords(data.pagination.total);
    setRowsPerPage(data.pagination.limit);
    setLoading(false);
  };

  // Handle page change
  const onPageChange = (event: DataTablePageEvent) => {
    setPage(event.page??0 + 1); // PrimeReact is zero-based indexing
  };

  // Handle row selection and persist across pages
  const onRowSelection = (event: any) => {
    const selectedData = event.value as Artwork[];
    const newSelectedRows = { ...selectedRows };

    artworks.forEach((item) => {
      newSelectedRows[item.id] = selectedData.some((row) => row.id === item.id);
    });

    setSelectedRows(newSelectedRows);
  };

  // Row checkbox renderer (checks state for persistence)
  const rowCheckboxTemplate = (rowData: Artwork) => (
    <Checkbox
      checked={!!selectedRows[rowData.id]}
      onChange={() => toggleRowSelection(rowData)}
    />
  );

  const toggleRowSelection = (rowData: Artwork) => {
    setSelectedRows((prev) => ({
      ...prev,
      [rowData.id]: !prev[rowData.id],
    }));
  };

  return (
    <div className="card">
      <DataTable
        value={artworks}
        lazy
        paginator
        rows={10}
        totalRecords={totalRecords}
        loading={loading}
        onPage={onPageChange}
        selectionMode="checkbox"
        selection={artworks.filter((row) => selectedRows[row.id])}
        onSelectionChange={onRowSelection}
        dataKey="id"
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
        <Column header="Title" field="title" />
        <Column header="Origin" field="place_of_origin" />
        <Column header="Artist" field="artist_display" />
        <Column header="Inscriptions" field="inscriptions" />
        <Column header="Start Date" field="date_start" />
        <Column header="End Date" field="date_end" />
      </DataTable>
    </div>
  );
};

export default DataTableComponent;
