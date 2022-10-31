import React, { useState, useEffect } from "react";
import { getAllRealEstate } from '../../API_handler/api'

import Datatable from "react-data-table-component";
import { Button } from "react-bootstrap";

const AssetTable = () => {
  // const [search, setSearch] = useState([]);
  // useState without type would be a bug when coding in TypeScript
  const [assets, setAssets] = useState([]);

  const getAssets = async () => {
    try {
      const response = await getAllRealEstate();
      // parse the response array
      const data = JSON.parse(response);
      console.log(data)
      setAssets(data);
    } catch (error) {
      console.log(error);
    }
  };

  // Columns for table, data is from country data

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Asset ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Location",
      selector: (row) => row.location,
      sortable: true,
    },
    // {
    //   name: "Ownership Percents",
    //   selector: (row) => row.nativeName,
    // },
    // {
    //   name: "Payment Date",
    //   selector: (row) => row.capital,
    // },
    // {
    //   name: "Price",
    //   selector: (row) => row.numericCode && row.callingCodes,
    // },
  ];

  useEffect(() => {
    getAssets();
  }, []);

  return (
    <Datatable
      title="Real Estate List"
      columns={columns}
      data={assets}
      pagination
      fixedHeader
      fixedHeaderScrollHeight="400px"
      selectableRows
      selectableRowsHighlight
      highlightOnHover
      actions={<Button className="btn btn-info">Export</Button>}
      subHeader
      subHeaderComponent={
        <input
          type="text"
          className="w-25 form-control"
          placeholder="Search here"
        // value={search}
        // onChange={() => setSearch(e.target.value)}
        />
      }
    />
  );
};

export default AssetTable;
