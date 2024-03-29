import Vue from 'vue'
import VueApollo from 'vue-apollo'
import { createApolloClient, restartWebsockets } from 'vue-cli-plugin-apollo/graphql-client'
// import { setContext } from 'apollo-link-context'
// import { ApolloLink } from 'apollo-link'
// import { InMemoryCache } from 'apollo-cache-inmemory'
// import { HttpLink } from 'apollo-link-http'

Vue.use(VueApollo)

// Name of the localStorage item
// const AUTH_TOKEN = 'apollo-token'
const AUTH_TOKEN = 'authenticate-user-token'

// const graphcoolURI = 'https://api.graph.cool/simple/v1/cjjzt28rc13n90179vyze0inq'
// const graphcoolURI = 'https://api.graph.cool/simple/v1/cjluwggxg2ail0195ilui6u3j'
const graphcoolURI = 'https://api.graph.cool/simple/v1/cjlw6enft0hds016406xkhcjh'

// const wsEndpointURI = 'wss://subscriptions.graph.cool/v1/cjjzt28rc13n90179vyze0inq'
// const wsEndpointURI = 'wss://subscriptions.graph.cool/v1/cjluwggxg2ail0195ilui6u3j'
const wsEndpointURI = 'wss://subscriptions.graph.cool/v1/cjlw6enft0hds016406xkhcjh'


// Config
const defaultOptions = {
  // You can use `https` for secure connection (recommended in production)
  // httpEndpoint: process.env.VUE_APP_GRAPHQL_HTTP || 'http://localhost:4000/graphql',
  httpEndpoint:  graphcoolURI,
  // You can use `wss` for secure connection (recommended in production)
  // Use `null` to disable subscriptions
  // wsEndpoint: process.env.VUE_APP_GRAPHQL_WS || 'ws://localhost:4000/graphql',
  wsEndpoint: wsEndpointURI,
  // LocalStorage token
  tokenName: AUTH_TOKEN,
  // Enable Automatic Query persisting with Apollo Engine
  persisting: false,
  // Use websockets for everything (no HTTP)
  // You need to pass a `wsEndpoint` for this to work
  websocketsOnly: false,
  // Is being rendered on the server?
  ssr: false,

  // Override default http link
  // link: myLink

  // Override default cache
  // cache: myCache

  // Override the way the Authorization header is set
  // getAuth: (tokenName) => ...

  // Additional ApolloClient options
  // apollo: { ... }

  // Client local data (see apollo-link-state)
  // clientState: { resolvers: { ... }, defaults: { ... } }
  connectToDevTools: true
}

// Call this in the Vue app file
export function createProvider (options = {}) {
  // Create apollo client
  const { apolloClient, wsClient } = createApolloClient({
    ...defaultOptions,
    ...options,
  })
  apolloClient.wsClient = wsClient

  // Create vue apollo provider
  const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
    defaultOptions: {
      $query: {
        // fetchPolicy: 'cache-and-network',
      },
    },
    errorHandler (error) {
      // eslint-disable-next-line no-console
      console.log('%cError', 'background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;', error.message)
    },
  })

  return apolloProvider
}

// Manually call this when user log in
export async function onLogin (apolloClient, token) {
  localStorage.setItem(AUTH_TOKEN, token)
  if (apolloClient.wsClient) restartWebsockets(apolloClient.wsClient)
  try {
    await apolloClient.resetStore()
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('%cError on cache reset (login)', 'color: orange;', e.message)
  }
}

// Manually call this when user log out
export async function onLogout (apolloClient) {
  localStorage.removeItem(AUTH_TOKEN)
  if (apolloClient.wsClient) restartWebsockets(apolloClient.wsClient)
  try {
    await apolloClient.resetStore()
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('%cError on cache reset (logout)', 'color: orange;', e.message)
  }
}
