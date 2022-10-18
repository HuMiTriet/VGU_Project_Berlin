import axios from 'axios'
async function getAssets(): Promise<string> {
  const host = '172.19.60.228'
  const allAssets = await axios.get(`http://${host}:3001/api/assets`)
  const data = allAssets.data
  return JSON.stringify(data)
}

export { getAssets }
