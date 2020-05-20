/**
 * Function to filter keys from an object
 * @param ids
 * @param { data }
 * @return { data }
 */
export const deleteKey = (ids, { ...data }) => {
  ids.forEach((id) => {
    delete data[id]
  })
  return data
}
