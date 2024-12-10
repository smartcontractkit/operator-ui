import {
  ApolloClient,
  defaultDataIdFromObject,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import generatedIntrospection from 'src/types/generated/possibleTypes'

const baseURL = process.env.CHAINLINK_BASEURL ?? location.origin

const httpLink = new HttpLink({
  uri: `${baseURL}/query`,
  credentials: 'include',
})

export const client = new ApolloClient({
  cache: new InMemoryCache({
    possibleTypes: generatedIntrospection.possibleTypes,
    // we need to explicitly handle the uniqueness of chain object because
    // ID is not unique across as different network can have the same ID
    // which confuses the caching of apollo client.
    // the code below is to override the handling of uniqueness for Chain type.
    dataIdFromObject(responseObject) {
      switch (responseObject.__typename) {
        case 'Chain':
          if (!responseObject.network) {
            throw new Error(
              'Due to Chain ID not being unique across chain, ensure network is fetched too',
            )
          }
          return `Chain:${responseObject.network}:${responseObject.id}`
        default:
          return defaultDataIdFromObject(responseObject)
      }
    },
  }),
  link: httpLink,
})
