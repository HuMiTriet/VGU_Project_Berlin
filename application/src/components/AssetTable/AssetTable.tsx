import { useState, useEffect } from 'react'
import { getUserRealEstate } from '../../API_handler/api'

import Datatable from 'react-data-table-component'
import { Button } from 'react-bootstrap'
import { RealEstate } from '../../resources/realEstate'
import { Ownership } from '../../resources/ownership'
import { Form } from 'antd'

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
      name: 'Owning Percentage',
      selector: (row: RealEstate) => {
        const ownerArray: Ownership[] = row.owners
        for (const owner of ownerArray) {
          if (owner.ownerID === userID) {
            return owner.ownershipPercentage
          }
        }
      },
      sortable: true,
      wrap: true
    },
    {
      name: 'Location',
      selector: (row: RealEstate) => row.location,
      sortable: true,
      wrap: true
    },
    {
      name: 'Membership Threshold',
      selector: (row: RealEstate) => row.membershipThreshold,
      sortable: true,
      wrap: true
    },
    {
      name: 'Area',
      selector: (row: RealEstate) => row.area,
      sortable: true,
      wrap: true
    },
    {
      name: 'Bath rooms',
      selector: (row: RealEstate) => row.roomList.numOfBathroom,
      sortable: true,
      wrap: true
    },
    {
      name: 'Bed rooms',
      selector: (row: RealEstate) => row.roomList.numOfBedroom,
      sortable: true,
      wrap: true
    },
    {
      name: 'Dining rooms',
      selector: (row: RealEstate) => row.roomList.numOfDiningroom,
      sortable: true,
      wrap: true
    },
    {
      name: 'Living rooms',
      selector: (row: RealEstate) => row.roomList.numOfLivingroom,
      sortable: true,
      wrap: true
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
      sortable: true,
      wrap: true
    },
    {
      name: 'Sell Percentage',
      selector: (row: RealEstate) => {
        const ownerArray: Ownership[] = row.owners
        for (const owner of ownerArray) {
          if (owner.ownerID === userID) {
            return owner.sellPercentage
          }
        }
      },
      sortable: true,
      wrap: true
    },
    {
      name: 'Sell Price',
      selector: (row: RealEstate) => {
        const ownerArray: Ownership[] = row.owners
        for (const owner of ownerArray) {
          if (owner.ownerID === userID) {
            return owner.sellPrice
          }
        }
      },
      sortable: true,
      wrap: true
    },
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
      selectableRowsSingle
      selectableRowsHighlight
      highlightOnHover
      // actions={<Button className="btn btn-info">Export</Button>}
      subHeader
      onRowClicked={(row: RealEstate) => {
        localStorage.setItem('editRealEstate', JSON.stringify(row))
        window.open('/editasset', '_self')
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
