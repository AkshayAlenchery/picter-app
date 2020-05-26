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

export const mergeArrays = (arr1, arr2) => {
  const newArr = [...arr1, ...arr2]
  console.log('ak', newArr)
  return Array.from(new Set(newArr))
}
