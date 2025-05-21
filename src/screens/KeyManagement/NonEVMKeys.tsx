import React from 'react'

import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress'

import { NonEVMKeysCard } from './NonEVMKeysCard'
import { useNonEvmAccountsQuery } from 'src/hooks/queries/useNonEvmAccountsQuery'

const SCHEMAS = {
  aptosKeys: {
    title: 'Aptos',
    fields: [
      { label: 'Public Key', key: 'id', copy: true },
      { label: 'Account', key: 'account', copy: true },
    ],
  },
  solanaKeys: {
    title: 'Solana',
    fields: [{ label: 'Public Key', key: 'id', copy: true }],
  },
  starknetKeys: {
    title: 'Starknet',
    fields: [{ label: 'Public Key', key: 'id', copy: true }],
  },
  tronKeys: {
    title: 'TRON',
    fields: [{ label: 'Public Key', key: 'id', copy: true }],
  },
  tonKeys: {
    title: 'TON',
    fields: [
      { label: 'Public Key', key: 'id', copy: true },
      { label: 'Base64 Address', key: 'addressBase64', copy: true },
      { label: 'Raw Address', key: 'rawAddress', copy: true },
    ],
  },
}

export const NonEVMKeys = () => {
  const { data, loading, error } = useNonEvmAccountsQuery({
    fetchPolicy: 'cache-and-network',
  })
  // TODO:
  // const [createNonEVMKey] = useMutation<CreateCsaKey, CreateCsaKeyVariables>(
  //   CREATE_NONEVM_KEY_MUTATION,
  // )

  const handleCreate = async () => {
    // try {
    //   const result = await createNonEVMKey()
    //
    //   const payload = result.data?.createNonEVMKey
    //   switch (payload?.__typename) {
    //     case 'CreateNonEVMKeySuccess':
    //       dispatch(notifySuccessMsg('NonEVM Key created'))
    //
    //       refetch()
    //
    //       break
    //   }
    // } catch (e) {
    //   handleMutationError(e)
    // }
  }

  return (
    <>
      {loading && (
        <Grid
          item
          xs={12}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <CircularProgress data-testid="loading-spinner" size={24} />
        </Grid>
      )}

      {data &&
        Object.entries(data).map(
          ([key, chain]) =>
            typeof chain === 'object' &&
            'results' in chain &&
            chain.results?.length > 0 && (
              <NonEVMKeysCard
                loading={loading}
                schema={
                  SCHEMAS[key as keyof typeof SCHEMAS] || {
                    title: key,
                    fields: [{ label: 'Public Key', key: 'id', copy: true }],
                  }
                }
                data={chain}
                errorMsg={error?.message}
                onCreate={handleCreate}
                key={key}
              />
            ),
        )}
    </>
  )
}
