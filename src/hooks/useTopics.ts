'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useTopics() {
  return useQuery({
    queryKey: ['topics'],
    queryFn: async () => {
      const res = await fetch('/api/topics')
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      return json.data
    },
  })
}

export function useTopic(topicId: string) {
  return useQuery({
    queryKey: ['topic', topicId],
    queryFn: async () => {
      const res = await fetch(`/api/topics/${topicId}`)
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      return json.data
    },
    enabled: !!topicId,
  })
}

export function useCreateTopic() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch('/api/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      return json.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['topics'] }),
  })
}

export function useUpdateTopic(topicId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch(`/api/topics/${topicId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      return json.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] })
      queryClient.invalidateQueries({ queryKey: ['topic', topicId] })
    },
  })
}
