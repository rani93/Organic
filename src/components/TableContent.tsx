import { useState, useEffect, useRef } from 'react';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { fetchArtworks } from '../services/apiService';
import { Checkbox } from 'primereact/checkbox';
import { OverlayPanel } from 'primereact/overlaypanel';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';

interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

export default function PaginatorBasicDemo() {
  const [artWork, setArtWork] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalRecord, setTotalRecord] = useState<number>(0);
  const [pages, setPages] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [selectedRows, setSelectedRows] = useState<Artwork[]>([]);

  const overlayRef = useRef<OverlayPanel>(null); // Reference for OverlayPanel

  // Load data when the page number changes
  useEffect(() => {
    loadData(pages);
  }, [pages, rowsPerPage]);

  const loadData = async (pageNumber: number) => {
    setLoading(true);
    try {
      const data = await fetchArtworks(pageNumber);
      setArtWork(data.data);
      setTotalRecord(data.pagination.total);
      setRowsPerPage(data.pagination.limit);
    } catch (error) {
      console.error('Error fetching artworks:', error);
    } finally {
      setLoading(false);
    }
  };

  const onPageChange = (event: DataTablePageEvent) => {
    setPages((event.page ?? 0) + 1);
    setRowsPerPage(event.rows);
  };

  const onRowSelection = (event: { value: Artwork[] }) => {
    setSelectedRows(event.value);
  };

  // Custom header template with Overlay functionality
  const headerTemplate = (event: any) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {/* <Checkbox
        onChange={(e) => toggleSelectAll(e.checked)}
        checked={selectedRows.length === artWork.length && artWork.length > 0}
      /> */}
      <i
        className="pi pi-chevron-down"
        style={{ marginLeft: '8px', fontSize: '1rem', cursor: 'pointer' }}
        onClick={(e) => overlayRef.current?.toggle(e)} // Toggle OverlayPanel
      ></i>
      {/* OverlayPanel */}
      <OverlayPanel ref={overlayRef}>
        <input type='text' placeholder='select row' name='rows'/>
        <label htmlFor='rows'/>
        <br />
        <Button label='submit' text raised></Button>
      </OverlayPanel>
    </div>
  );

  const toggleSelectAll = (checked: boolean | undefined) => {
    if (checked) {
      setSelectedRows([...artWork]);
    } else {
      setSelectedRows([]);
    }
  };

  return (
    <div className="card">
      <DataTable
        value={artWork}
        lazy
        paginator
        rows={rowsPerPage}
        totalRecords={totalRecord}
        loading={loading}
        onPage={onPageChange}
        selectionMode="checkbox"
        selection={selectedRows}
        onSelectionChange={onRowSelection}
        dataKey="id"
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: '50rem' }}
      >
        <Column
          selectionMode="multiple"
        //   header={headerTemplate} // Custom header with chevron-down functionality
          headerStyle={{ width: '3rem' }}
        />
        <Column header = {headerTemplate} />
        <Column header="Title" field="title" />
        <Column header="Origin" field="place_of_origin" />
        <Column header="Artist" field="artist_display" />
        <Column header="Inscriptions" field="inscriptions" />
        <Column header="Start Date" field="date_start" />
        <Column header="End Date" field="date_end" />
      </DataTable>
    </div>
  );
}