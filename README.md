# Vuex-Queries

[![Build Status](https://travis-ci.org/whtsky/vuex-queries.svg?branch=master)](https://travis-ci.org/whtsky/vuex-queries)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![codecov](https://codecov.io/gh/whtsky/vuex-queries/branch/master/graph/badge.svg)](https://codecov.io/gh/whtsky/vuex-queries)
[![NPM version](https://img.shields.io/npm/v/vuex-queries.svg?style=flat)](https://npmjs.com/package/vuex-queries)


Vuex-Queries helps you write query functions in Vuex

## Usage
Write your queries in Vuex options:
```js
const options = {
  state: {
    events: [{id: 1, author: ['a', 'b']}, {id: 2, author: ['b', 'c']}, {id: 3, author: ['c', 'a']}],
  },
  queries: {
    getEventByAuthors (context, authors) {
      return context.state.events.filter(e => authors.every(author => e.author.includes(author)))
    }
  }
}
```

Query functions receive a context object which contains store's state and getters. You can access them by `context.state` or `context.getters`, or using Object Destructuring feature in ES2015:
```js
const options = {
  state: {
    events: [{id: 1, author: ['a', 'b']}, {id: 2, author: ['b', 'c']}, {id: 3, author: ['c', 'a']}],
  },
  queries: {
    getEventByAuthors ({state, getters}, authors) {
      return state.events.filter(e => authors.every(author => e.author.includes(author)))
    }
  }
}
```

Inside module queries, context will also contain `rootState` and `rootGetters`.
```js
const options = {
  state: {
    events: [{id: 1, author: ['a', 'b']}, {id: 2, author: ['b', 'c']}, {id: 3, author: ['c', 'a']}],
  },
  computed: {
    currentAuthor (state) {
      return state.author[0]
    }
  },
  modules: {
    foo: {
      namespaced: true,
      queries: {
        getEvents ({rootState, rootGetters}, authors) {
          return rootState.events.filter(e => authors.concat(rootGetters.currentAuthor).every(author => e.author.includes(author)))
        }
      }
    }
  }
}
```

Before creating Vuex store, transform the options with `supportQuery(options)` method:
```js
import Vuex from 'vuex'
import { supportQuery } from 'vuex-queries'
const store = new Vuex.Store(supportQuery(options))
```

Use `mapQueries(namespace, map)` method (which has the same parameters as [other component binding helpers](https://vuex.vuejs.org/en/api.html#component-binding-helpers)) to map component methods to query functions:
```jsx

import { mapQueries } from 'vuex-queries'

export default {
  methods: {
    ...mapQueries(['getEventByAuthors'])
  },
  render () {
    return (
      <div>
        {this.getEventByAuthors(['a', 'c']).map(e => (
          <p>Event: {e.id}</p>
        ))}
      </div>
    )
  }
}
```

## Changelog

### v1.1.1

+ update peerDependencies to allow work with Vuex 3.x

### v1.1.0

+ Add support for `rootState` & `rootGetters`
