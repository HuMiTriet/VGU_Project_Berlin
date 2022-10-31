import React, { useState, useEffect } from 'react'
import axios from 'axios'

import Datatable from 'react-data-table-component'
import { Button } from 'react-bootstrap'

const AssetTable = () => {
  // const [search, setSearch] = useState([]);
  // useState without type would be a bug when coding in TypeScript
  const [assets, setAssets] = useState([])

  const getAssets = async () => {
    try {
      const response = await axios.get('https://restcountries.com/v2/all')
      setAssets(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  // Columns for table, data is from country data

  const columns = [
    // {
    //   name: " ",
    //   selector: (row) => (
    //     <img width={40} height={40} alt="asset" src={row.flag} />
    //   ),
    // },
    {
      name: 'Asset Name',
      selector: row => row.name,
      sortable: true
    },
    {
      name: 'Asset ID',
      selector: row => row.alpha3Code,
      sortable: true
    },
    {
      name: 'Agency',
      selector: row => row.name,
      sortable: true
    },
    {
      name: 'Ownership Percents',
      selector: row => row.nativeName
    },
    {
      name: 'Payment Date',
      selector: row => row.capital
    },
    {
      name: 'Price',
      selector: row => row.numericCode && row.callingCodes
    }
  ]

  // customStyles for Datatable will deep merges your customStyles with the default styling.
  // Source: https://react-data-table-component.netlify.app/?path=/docs/api-custom-styles--page
  // Check source code for detailed styles that can be overriden
  // https://github.com/jbetancur/react-data-table-component/blob/master/src/DataTable/styles.ts
  const customStyles = {
    table: {
      style: {
        width: '90vw',
        margin: 'auto',
      }
    },
    // Style for Table Header: title + button Export
    // header: {
    //   style: {
    //     margin: 'auto',
    //     padding: '0',
    //     color: 'black',
    //     fontSize: '20px',
    //     position: 'relative',
    //   }
    // },
    rows: {
      style: {
        minHeight: '65px' // override the row height
      }
    },
    headCells: {
      style: {
        paddingLeft: '8px', // override the cell padding for head cells
        paddingRight: '8px'
      }
    },
    cells: {
      style: {
        paddingLeft: '8px', // override the cell padding for data cells
        paddingRight: '8px'
      }
    }
  }

  useEffect(() => {
    getAssets()
  }, [])

  return (
    <Datatable
      customStyles={customStyles}
      title="Asset Paid"
      columns={columns}
      data={assets}
      pagination
      fixedHeader
      fixedHeaderScrollHeight="500px"
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
  )
}

export default AssetTable
