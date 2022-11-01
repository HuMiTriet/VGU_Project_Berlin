import { useState, useEffect } from 'react'
import { getUserRealEstate } from '../../API_handler/api'

import Datatable from 'react-data-table-component'
import { Button } from 'react-bootstrap'
import { RealEstate } from '../../resources/realEstate'
import { Ownership } from '../../resources/ownership'

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
      sortable: true
    },
    {
      name: 'Asset ID',
      selector: (row: RealEstate) => row.id,
      sortable: true
    },
    {
      name: 'Location',
      selector: (row: RealEstate) => row.location,
      sortable: true
    },
    {
      name: 'Membership Threshold',
      selector: (row: RealEstate) => row.membershipThreshold,
      sortable: true
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
    // {
    //   name: 'edit',
    //   cell: row => (
    //     <button onClick={clickHandler} id={row.id}>
    //       Action
    //     </button>
    //   )
    // }
  ]

  // let clickHandler = state => {
  //   console.log(state.target.id)
  // }

  useEffect(() => {
    getAssets()
  }, [])

  return (
    <Datatable
      title="Real Estate List"
      columns={columns}
      data={assets}
      pagination
      fixedHeader
      fixedHeaderScrollHeight="400px"
      selectableRowsSingle
      selectableRowsHighlight
      highlightOnHover
      actions={<Button className="btn btn-info">Export</Button>}
      subHeader
      onRowClicked={(row, event) => {
        // show the pop up Form
        return (
          <div>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input className="form-control" id="name" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="name@example.com"
              />
            </div>
            <div className="form-group">
              <button className="form-control btn btn-primary" type="submit">
                Submit
              </button>
            </div>
          </div>
        )
      }}
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
