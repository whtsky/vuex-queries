const test = require('ava')
const { supportQuery, mapQueries } = require('./index')

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

test.todo('transform modules as well')

test.todo('mapQueries works with array')
test.todo('mapQueries works with object')
test.todo('mapQueries works with namespace')
test.todo('mapQueries works with namespace and a nested module')
