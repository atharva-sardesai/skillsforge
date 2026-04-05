'use client'

import { useQuery } from '@tanstack/react-query'

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await fetch('/api/profile')
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      return json.data
    },
  })
}
