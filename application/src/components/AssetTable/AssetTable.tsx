import { useState, useEffect } from 'react'
import { getUserRealEstate } from '../../API_handler/api'

import Datatable from 'react-data-table-component'
//import { Button } from 'react-bootstrap'
import { RealEstate } from '../../resources/realEstate'
import { Ownership } from '../../resources/ownership'
import { Button } from 'antd'
import React from 'react'

const AssetTable = () => {
  // const [search, setSearch] = useState([]);
  // useState without type would be a bug when coding in TypeScript
  const [assets, setAssets] = useState([])
  const userID = localStorage['userID']

  const getAssets = async () => {
    try {
      const response = await getUserRealEstate(userID)
      const data: RealEstate[] = JSON.parse(response)
      setAssets(data)
    } catch (error) {
      console.log(error)
    }
  }

  const [selectedRows, setSelectedRows] = React.useState([])
  const [toggleCleared, setToggleCleared] = React.useState(false)
  const [data, setData] = React.useState(assets as RealEstate[])

  const handleRowSelected = React.useCallback(state => {
    setSelectedRows(state.selectedRows)
  }, [])

  const contextActions = React.useMemo(() => {
    const handleDelete = () => {
      if (
        window.confirm(
          `Are you sure you want to delete:\r ${selectedRows.map(
            r => r.name
          )}?`
        )
      ) {
        setToggleCleared(!toggleCleared)
        //setData(differenceBy(data, selectedRows, 'title'));
      }
    }

    const handleEdit = () => {
      if (
        window.confirm(
          `Are you sure you want to edit:\r ${selectedRows.map(r => r.name)}?`
        )
      ) {
        setToggleCleared(!toggleCleared)
        //setData(differenceBy(data, selectedRows, 'title'));
      }
    }

    if (selectedRows.length === 1) {
      return (
        <div>
          <Button
            key="Edit"
            onClick={handleEdit}
            style={{ backgroundColor: 'yellow' }}
            icon
          >
            Edit
          </Button>
          <Button
            key="delete"
            onClick={handleDelete}
            style={{ backgroundColor: 'red' }}
            icon
          >
            Delete
          </Button>
        </div>
      )
    }

    return (
      <Button
        key="delete"
        onClick={handleDelete}
        style={{ backgroundColor: 'red' }}
        icon
      >
        Delete
      </Button>
    )
  }, [data, selectedRows, toggleCleared])

  // Columns for table, data is from country data
  const columns = [
    {
      name: 'Name',
      selector: (row: RealEstate) => row.name,
      sortable: true,
      wrap: true
    },
    {
      name: 'Asset ID',
      selector: (row: RealEstate) => row.id,
      sortable: true,
      wrap: true
    },
    {
      name: 'Location',
      selector: (row: RealEstate) => row.location,
      sortable: true
    },
    {
      name: 'Membership Threshold',
      selector: (row: RealEstate) => row.membershipThreshold,
      sortable: true,
      wrap: true
    },
    {
      name: 'Bath rooms',
      selector: (row: RealEstate) => row.roomList.numOfBathroom,
      sortable: true
    },
    {
      name: 'Bed rooms',
      selector: (row: RealEstate) => row.roomList.numOfBedroom,
      sortable: true
    },
    {
      name: 'Dining rooms',
      selector: (row: RealEstate) => row.roomList.numOfDiningroom,
      sortable: true
    },
    {
      name: 'Living rooms',
      selector: (row: RealEstate) => row.roomList.numOfLivingroom,
      sortable: true
    },
    {
      name: 'Listing',
      selector: (row: RealEstate) => {
        const ownerArray: Ownership[] = row.owners
        for (const owner of ownerArray) {
          if (owner.ownerID === userID) {
            return owner.isSeller ? 'Yes' : 'No'
          }
        }
      },
      sortable: true
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
        margin: 'auto'
      }
    },
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
      title="Real Estate List"
      columns={columns}
      data={assets}
      pagination
      fixedHeader
      fixedHeaderScrollHeight="500px"
      selectableRows
      selectableRowsHighlight
      highlightOnHover
      //actions={<Button className="btn btn-info">Export</Button>}
      subHeader
      onSelectedRowsChange={handleRowSelected}
      contextActions={contextActions}
      clearSelectedRows={toggleCleared}
      onRowClicked={(row: RealEstate) => {
        console.log(row)
      }}
      // subHeaderComponent={
      //   <input
      //     type="text"
      //     className="w-25 form-control"
      //     placeholder="Search here"
      //     // value={search}
      //     // onChange={() => setSearch(e.target.value)}
      //   />
      // }
    />
  )
}

export default AssetTable
