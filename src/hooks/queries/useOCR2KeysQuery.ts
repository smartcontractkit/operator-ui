import { gql, QueryHookOptions, useMutation, useQuery } from '@apollo/client'

export const OCR2_KEY_BUNDLES_PAYLOAD__RESULTS_FIELDS = gql`
  fragment OCR2KeyBundlesPayload_ResultsFields on OCR2KeyBundle {
    id
    chainType
    configPublicKey
    onChainPublicKey
    offChainPublicKey
  }
`

export const OCR2_KEY_BUNDLES_QUERY = gql`
  ${OCR2_KEY_BUNDLES_PAYLOAD__RESULTS_FIELDS}
  query FetchOCR2KeyBundles {
    ocr2KeyBundles {
      results {
        ...OCR2KeyBundlesPayload_ResultsFields
      }
    }
  }
`
export const DELETE_OCR2_KEY_BUNDLE_MUTATION = gql`
  mutation DeleteOCR2KeyBundle($id: ID!) {
    deleteOCR2KeyBundle(id: $id) {
      ... on DeleteOCR2KeyBundleSuccess {
        bundle {
          id
        }
      }
    }
  }
`

export const CREATE_OCR2_KEY_BUNDLE_MUTATION = gql`
  mutation createOCR2KeyBundle($chainType: OCR2ChainType!) {
    createOCR2KeyBundle(chainType: $chainType) {
      ... on CreateOCR2KeyBundleSuccess {
        bundle {
          chainType
          configPublicKey
          id
          offChainPublicKey
          onChainPublicKey
        }
      }
    }
  }
`

export const OCR2_KEY_FAMILY = gql`
  query GetChainFamily {
    __type(name: "OCR2ChainType") {
      enumValues {
        name
      }
    }
  }
`

// useOCRKeysQuery fetches the chains
export const useOCR2KeysQuery = (opts: QueryHookOptions = {}) => {
  return useQuery<FetchOcr2KeyBundles>(OCR2_KEY_BUNDLES_QUERY, opts)
}

// useDeleteOCR2KeyBundleMutation deletes a key bundle
export const useDeleteOCR2KeyBundleMutation = () => {
  return useMutation<DeleteOcr2KeyBundle, DeleteOcr2KeyBundleVariables>(
    DELETE_OCR2_KEY_BUNDLE_MUTATION,
  )
}

// useCreateOCR2KeyBundleMutation creates a key bundle
export const useCreateOCR2KeyBundleMutation = () => {
  return useMutation<CreateOcr2KeyBundle>(CREATE_OCR2_KEY_BUNDLE_MUTATION)
}

// useOCR2KeyFamilyQuery fetches the supported chain family types
export const useOCR2KeyFamilyQuery = (opts: QueryHookOptions = {}) => {
  return useQuery(OCR2_KEY_FAMILY, opts)
}
