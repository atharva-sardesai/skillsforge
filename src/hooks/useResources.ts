'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useResources(filters?: { topicId?: string; type?: string; search?: string }) {
  const params = new URLSearchParams()
  if (filters?.topicId) params.set('topicId', filters.topicId)
  if (filters?.type) params.set('type', filters.type)
  if (filters?.search) params.set('search', filters.search)

  return useQuery({
    queryKey: ['resources', filters],
    queryFn: async () => {
      const res = await fetch(`/api/resources?${params.toString()}`)
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      return json.data
    },
  })
}

export function useDeleteResource() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (resourceId: string) => {
      const res = await fetch(`/api/resources/${resourceId}`, { method: 'DELETE' })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      return json.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] })
    },
  })
}
