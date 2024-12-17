import React from "react";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./index.css";
// import DataTableComponent from "./components/DataTableComponent";
import PaginatorBasicDemo from "./components/TableContent";

const App: React.FC = () => {
  return (
    <div>
      <h1>Artworks Table</h1>
      {/* <DataTableComponent /> */}
      <PaginatorBasicDemo/>
    </div>
  );
};

export default App;