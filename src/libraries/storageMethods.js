import {pipe} from '../libraries/helpers'

export const createStorage = (key) => {
  key = key ?? false

  return (!key || localStorage.hasOwnProperty(key))
    ? null
    : (
      (key) => {
        localStorage.setItem(key,0)
        localStorage.setItem(key+'/list', JSON.stringify([]))
      }
    )(key)
}

export const deleteStorage = (key, storageName, id = null) => {
  id = id ?? null;

  if(id !== null){
    const $storageList = selectStorage(key, storageName)
    const $storageResult = $storageList.filter(item => item.id !== id)
    localStorage.setItem(key +'/'+storageName,JSON.stringify($storageResult))
  }
}

export const insertStorage = (key, storageName, todo = null) => {
  let lastId = getIdent(key)
  let storageList = selectStorage(key,storageName)
  todo['id'] = ++lastId

  storageList.push(todo)

  localStorage.setItem(key,lastId)
  localStorage.setItem(key+'/'+storageName,JSON.stringify(storageList))
}

export const selectStorage = (key, storageName, fields = null, where = null, orderBy = null) => {
  const actionsList = []

  key = key ?? false
  storageName = storageName ?? false
  actionsList.push((where !== null) ? (list) => (whereSelect)(list,where) : null)
  actionsList.push((orderBy !== null) ? (list) => (orderSelect)(list,orderBy) : null)
  const actions = actionsList.filter(Boolean)

  if(key && storageName && localStorage.hasOwnProperty(key +'/'+ storageName) && localStorage.getItem(key +'/'+ storageName) !== 'null'){
    return (fields === null)
    ? (actions.length > 0)
      ? pipe(actions, JSON.parse(localStorage.getItem(key +'/'+ storageName)))[0]
      : JSON.parse(localStorage.getItem(key +'/'+ storageName))
    : []
  }

  return []
}

export const updateStorage = (key, storageName, id = null, params = null) => {
  key = key ?? false
  storageName = storageName ?? false

  return (!key || !storageName || id === null || params === null)
  ? false
  : (
    (id, params) => {
      let storageList = selectStorage(key,storageName)
      let storageRow = storageList
        .filter(item => item.id === parseInt(id))
        .map(obj => {
          Object.keys(params).forEach(key => {
            obj[key] = params[key]
          })
          return obj
        }) 

      let storageIndex = storageList.findIndex(obj => obj.id === parseInt(id))
      storageList[storageIndex] = storageRow[0]
      localStorage.setItem(key+'/'+storageName, JSON.stringify(storageList))
    }
  )(id, params)
}

export const getIdent = (key) => localStorage.getItem(key)

export const getStorageLength = (key, storageName) => {
  const storageList = selectStorage(key, storageName)
  return storageList.length
}

const orderSelect = (storageList, orderField = []) => {
  const orderAsc = (list, field) => { 
    return list.sort((itemA, itemB) => {
      if(isNaN(itemA[field])){
        if(itemA[field] >  itemB[field]) return 1
        if(itemA[field] <  itemB[field]) return -1
        return 0
      } else {
        return itemA[field] - itemB[field]
      }
    })
  }

  const orderDesc = (list, field) => { 
    return list.sort((itemA, itemB) => {
      if(isNaN(itemA[field])){
        if(itemB[field] >  itemA[field]) return 1
        if(itemB[field] <  itemA[field]) return -1
        return 0
      } else {
        return itemB[field] - itemA[field]
      }
    })
  }

  return orderField.map((param) => {
    const [field, classification] = param.split('|')
    return (classification === 'asc')
      ? orderAsc(storageList, field)
      : orderDesc(storageList, field)
  })
}

const whereSelect = (list, conditions = []) => {
  const situations = {
    '>':(field,value) => {
      const compareValue = isNaN(value) ? value : +value
      return field > compareValue
    },
    '<':(field, value) => {
      const compareValue = isNaN(value) ? value : +value
      return field < compareValue
    },
    '===':(field, value) => {
      const compareValue = isNaN(value) ? value : +value
      return field === compareValue
    },
    '!==':(field, value) => {
      const compareValue = isNaN(value) ? value : +value  
      return field !== compareValue
    },
    '==':(field, value) => {
      const compareValue = isNaN(value) ? value : +value
      return field == compareValue
    },
    '!=':(field, value) => {
      const compareValue = isNaN(value) ? value : +value
      return field != compareValue 
    },
    '>=':(field, value) => {
      const compareValue = isNaN(value) ? value : +value
      return field >= compareValue  
    },
    '<=':(field, value) => {
      const compareValue = isNaN(value) ? value : +value
      return field <= compareValue
    } 
  }

  return conditions.reduce((acu, condition) => {
    const [field, assign, value] = condition.split('|')
    return acu.filter(item => situations[assign](item[field],value))
  },list)
}