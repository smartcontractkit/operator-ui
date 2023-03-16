// buildOCR2KeyBundle builds a ocr2 key bundle for the FetchOCR2KeyBundles query.
export function buildOCR2KeyBundle(
  overrides?: Partial<Ocr2KeyBundlesPayload_ResultsFields>,
): Ocr2KeyBundlesPayload_ResultsFields {
  return {
    __typename: 'OCR2KeyBundle',
    id: '68ae4225aa9fd932e62a2411e4c757a9fa72de45426ac455801a6f08cb4392b3',
    chainType: 'EVM',
    configPublicKey:
      'ocr2cfg_evm_b04f2db79d3f7f6a7bf942c55119085f012f1aef4bb1df19765ddff79d01fa78',
    onChainPublicKey: 'ocr2on_evm_d16fc50d52b0cd2268a6d826fc5740a4a22de39b',
    offChainPublicKey:
      'ocr2off_evm_95a5c6777faeae4c3cd7b05961d31515274c368359e64cab9e3b5db76f69dfaa',
    ...overrides,
  }
}

// buildOCR2KeyBundles builds a list of ocr2 key bundles.
export function buildOCR2KeyBundles(): ReadonlyArray<Ocr2KeyBundlesPayload_ResultsFields> {
  return [
    buildOCR2KeyBundle(),
    buildOCR2KeyBundle({
      id: '3f44a22aa9ea34fb5ab8a3c04caeaacce3b9edd9d24fb410ce61f8dc77085539',
      chainType: 'SOLANA',
      configPublicKey:
        'ocr2cfg_solana_14b26702b79e19d0b708a9257e9d6803c6360f2d1eb4bee5d059a7a4f3aea26c',
      onChainPublicKey:
        'ocr2on_solana_18df35e43fd58cf2ed5cd3526f3a35dadcc31efc',
      offChainPublicKey:
        'ocr2off_solana_7fcf4bb539eb617ff0f55a436e9c45e5011de4021a1fa75ef27691794e38336e',
    }),
  ]
}
