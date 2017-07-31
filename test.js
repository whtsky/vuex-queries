import Vue from 'vue'
import Vuex from 'vuex'

import test from 'ava'
import sinon from 'sinon'

Vue.use(Vuex)

const { supportQuery, mapQueries } = require('./src')

const DUMMY_OPTION = {
  state: {
    events: [{id: 1, author: ['a', 'b']}, {id: 2, author: ['b', 'c']}, {id: 3, author: ['c', 'a']}],
    authors: ['a', 'b', 'c']
  },
  queries: {
    getEventByAuthors: function ({state, getters}, authors) {
      return state.events.filter(e => authors.every(author => e.author.includes(author)))
    }
  }
}

test('transformOptions', t => {
  const transformed = supportQuery(DUMMY_OPTION)
  t.is(typeof transformed.getters['$$vuex_query'], 'function')
})

test('transform modules as well', t => {
  const transformed = supportQuery({
    modules: {
      dummy: DUMMY_OPTION
    }
  })
  t.is(typeof transformed.modules.dummy.getters['$$vuex_query'], 'function')
})

test('mapQueries works with array', t => {
  const store = new Vuex.Store(supportQuery(DUMMY_OPTION))
  const vm = new Vue({
    store,
    methods: mapQueries(['getEventByAuthors'])
  })
  t.deepEqual(vm.getEventByAuthors(['a', 'b']), [{id: 1, author: ['a', 'b']}])
})

test('mapQueries works with object', t => {
  const store = new Vuex.Store(supportQuery(DUMMY_OPTION))
  const vm = new Vue({
    store,
    methods: mapQueries({
      getEvents: 'getEventByAuthors'
    })
  })
  t.deepEqual(vm.getEvents(['a', 'b']), [{id: 1, author: ['a', 'b']}])
})
test('mapQueries works with namespace', t => {
  const store = new Vuex.Store(supportQuery({
    modules: {
      foo: {
        namespaced: true,
        ...DUMMY_OPTION
      }
    }
  }))
  const vm = new Vue({
    store,
    methods: mapQueries('foo', ['getEventByAuthors'])
  })
  t.deepEqual(vm.getEventByAuthors(['b']), [{id: 1, author: ['a', 'b']}, {id: 2, author: ['b', 'c']}])
})
test('mapQueries works with namespace and a nested module', t => {
  const store = new Vuex.Store(supportQuery({
    modules: {
      foo: {
        namespaced: true,
        modules: {
          bar: {
            namespaced: true,
            ...DUMMY_OPTION
          }
        }
      }
    }
  }))
  const vm = new Vue({
    store,
    methods: mapQueries('foo/bar', ['getEventByAuthors'])
  })
  t.deepEqual(vm.getEventByAuthors(['a', 'c']), [{id: 3, author: ['c', 'a']}])
})

test('console.error when queries not defined', t => {
  const store = new Vuex.Store({})
  const vm = new Vue({
    store,
    methods: mapQueries(['foo'])
  })
  const stub = sinon.stub(console, 'error')
  t.is(vm.foo(), undefined, 'returns undefined when queries not defined')
  t.is(stub.callCount, 1)
  console.error.restore()
})

