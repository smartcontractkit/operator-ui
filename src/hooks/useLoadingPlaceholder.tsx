import React from 'react'
import { Typography } from '@mui/material'

export const useLoadingPlaceholder = (
  isLoading = false,
): {
  isLoading: boolean
  LoadingPlaceholder: React.FC
} => {
  const LoadingPlaceholder: React.FC = isLoading
    ? () => <Typography variant="body1">Loading...</Typography>
    : () => null

  return {
    isLoading,
    LoadingPlaceholder,
  }
}
