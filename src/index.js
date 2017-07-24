const QUERYS_KEY = '$$vuex_query'

function isObject (o) {
  return typeof o === 'object'
}

export function supportQuery (options) {
  const result = Object.assign({}, options)
  if (isObject(options.queries)) {
    result.getters = Object.assign({}, {
      [QUERYS_KEY]: (state, getters) => {
        const processed = {}
        for (const key in options.queries) {
          processed[key] = options.queries[key].bind(this, {state, getters})
        }
        return processed
      }
    }, options.getters)
  }

  if (isObject(options.modules)) {
    for (const key in options.modules) {
      const module = options.modules[key]
      result.modules[key] = supportQuery(module)
    }
  }

  return result
}

export const mapQueries = normalizeNamespace((namespace, map) => {
  let queries
  const res = {}
  const queriesKey = namespace + QUERYS_KEY
  normalizeMap(map).forEach(({ key, val }) => {
    res[key] = function mappedQuery (...args) {
      if (queries === undefined) {
        if (!this.$store.getters[queriesKey]) {
          console.error(`[vuex-queries] queries not defined in ${namespace || 'store'}`)
          return
        }
        queries = this.$store.getters[queriesKey]
      }
      if (!queries[val]) {
        console.error(`[vuex-queries] unknown query: ${val}`)
      } else {
        return queries[val].call(this, ...args)
      }
    }
  })
  console.log(res)
  return res
})

/**
 * The MIT License (MIT)
 * Copyright (c) 2015-2016 Evan You
 *
 * https://github.com/vuejs/vuex/blob/44d4a72c896aae339c62e24072621ce09bb94b9c/src/helpers.js#L80
 */
function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(key => ({ key, val: key }))
    : Object.keys(map).map(key => ({ key, val: map[key] }))
}

function normalizeNamespace (fn) {
  return (namespace, map) => {
    if (typeof namespace !== 'string') {
      map = namespace
      namespace = ''
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/'
    }
    return fn(namespace, map)
  }
}
