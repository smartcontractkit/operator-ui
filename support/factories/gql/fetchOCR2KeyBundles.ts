// buildOCR2KeyBundle builds a ocr2 key bundle for the FetchOCR2KeyBundles query.
export function buildOCR2KeyBundle(
  overrides?: Partial<Ocr2KeyBundlesPayload_ResultsFields>,
): Ocr2KeyBundlesPayload_ResultsFields {
  return {
    __typename: 'OCR2KeyBundle',
    id: '68ae4225aa9fd932e62a2411e4c757a9fa72de45426ac455801a6f08cb4392b3',
    chainType: 'EVM',
    configPublicKey: 'ocr2cfg_evm_b04f2db79d3f7f6a7bf942c55119085f012f1aef4bb1df19765ddff79d01fa78',
    onChainPublicKey: 'ocr2on_evm_d16fc50d52b0cd2268a6d826fc5740a4a22de39b',
    offChainPublicKey: 'ocr2off_evm_95a5c6777faeae4c3cd7b05961d31515274c368359e64cab9e3b5db76f69dfaa',
    ...overrides,
  }
}

// buildOCR2KeyBundles builds a list of ocr2 key bundles.
export function buildOCR2KeyBundles(): ReadonlyArray<Ocr2KeyBundlesPayload_ResultsFields> {
  return [
    buildOCR2KeyBundle(),
    buildOCR2KeyBundle({
      id: 'c1e547bbaea1936022d5ee7f221d14aa4e02a6b4d304889e95163dd501d70e18',
      chainType: 'STARKNET',
      configPublicKey: 'ocr2cfg_starknet_1153ad53f7e2f2ee5e79bf1bd08ffde219a4b96081e2479363c880e685e77444',
      onChainPublicKey: 'ocr2on_starknet_03aa0163b003d3bdeeda41b2944d533b1b1a919725131cf9fc1541f833774a2e',
      offChainPublicKey: 'ocr2off_starknet_97d74ce921831b1fd2d25f65a34209f492d6027a92a8ccca50b91575129336d8',
    }),
  ]
}
