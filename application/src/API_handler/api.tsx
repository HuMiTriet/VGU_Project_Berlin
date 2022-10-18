import axios from 'axios'
async function getAssets() {
  const host = '172.19.60.228'
  const allAssets = await axios.get(`http://${host}/assets`)

  console.log('getAssets' + allAssets)
  return allAssets
}

export { getAssets }
