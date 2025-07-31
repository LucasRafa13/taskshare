import React, { createContext, useContext, useState, useCallback } from 'react'
import {
  TaskList,
  CreateListRequest,
  UpdateListRequest,
  ShareListRequest,
} from '../types'
import { listService } from '../services/list.service'
import toast from 'react-hot-toast'

interface ListContextType {
  lists: TaskList[]
  currentList: TaskList | null
  isLoading: boolean
  fetchLists: () => Promise<void>
  fetchList: (id: string) => Promise<void>
  createList: (data: CreateListRequest) => Promise<TaskList>
  updateList: (id: string, data: UpdateListRequest) => Promise<void>
  deleteList: (id: string) => Promise<void>
  shareList: (listId: string, data: ShareListRequest) => Promise<void>
  removeShare: (listId: string, userId: string) => Promise<void>
}

const ListContext = createContext<ListContextType | null>(null)

export const useList = (): ListContextType => {
  const context = useContext(ListContext)
  if (!context) {
    throw new Error('useList must be used within a ListProvider')
  }
  return context
}

export const useListContext = useList

export const ListProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lists, setLists] = useState<TaskList[]>([])
  const [currentList, setCurrentList] = useState<TaskList | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchLists = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true)
      const fetchedLists = await listService.getLists()
      setLists(fetchedLists)
    } catch (error) {
      console.error('Failed to fetch lists:', error)
      toast.error('Erro ao carregar listas')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchList = useCallback(async (id: string): Promise<void> => {
    try {
      setIsLoading(true)
      const list = await listService.getList(id)
      setCurrentList(list)
    } catch (error) {
      console.error('Failed to fetch list:', error)
      toast.error('Erro ao carregar lista')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createList = useCallback(
    async (data: CreateListRequest): Promise<TaskList> => {
      try {
        const newList = await listService.createList(data)
        setLists((prev) => [newList, ...prev])
        toast.success('Lista criada com sucesso!')
        return newList
      } catch (error) {
        console.error('Failed to create list:', error)
        toast.error('Erro ao criar lista')
        throw error
      }
    },
    [],
  )

  const updateList = useCallback(
    async (id: string, data: UpdateListRequest): Promise<void> => {
      try {
        const updatedList = await listService.updateList(id, data)
        setLists((prev) =>
          prev.map((list) => (list.id === id ? updatedList : list)),
        )
        if (currentList?.id === id) {
          setCurrentList(updatedList)
        }
        toast.success('Lista atualizada com sucesso!')
      } catch (error) {
        console.error('Failed to update list:', error)
        toast.error('Erro ao atualizar lista')
        throw error
      }
    },
    [currentList],
  )

  const deleteList = useCallback(
    async (id: string): Promise<void> => {
      try {
        await listService.deleteList(id)
        setLists((prev) => prev.filter((list) => list.id !== id))
        if (currentList?.id === id) {
          setCurrentList(null)
        }
        toast.success('Lista excluída com sucesso!')
      } catch (error) {
        console.error('Failed to delete list:', error)
        toast.error('Erro ao excluir lista')
        throw error
      }
    },
    [currentList],
  )

  const shareList = useCallback(
    async (listId: string, data: ShareListRequest): Promise<void> => {
      try {
        await listService.shareList(listId, data)
        if (currentList?.id === listId) {
          await fetchList(listId)
        }
        toast.success('Lista compartilhada com sucesso!')
      } catch (error) {
        console.error('Failed to share list:', error)
        toast.error('Erro ao compartilhar lista')
        throw error
      }
    },
    [currentList, fetchList],
  )

  const removeShare = useCallback(
    async (listId: string, userId: string): Promise<void> => {
      try {
        await listService.removeShare(listId, userId)
        if (currentList?.id === listId) {
          await fetchList(listId)
        }
        toast.success('Compartilhamento removido com sucesso!')
      } catch (error) {
        console.error('Failed to remove share:', error)
        toast.error('Erro ao remover compartilhamento')
        throw error
      }
    },
    [currentList, fetchList],
  )

  const value: ListContextType = {
    lists,
    currentList,
    isLoading,
    fetchLists,
    fetchList,
    createList,
    updateList,
    deleteList,
    shareList,
    removeShare,
  }

  return <ListContext.Provider value={value}>{children}</ListContext.Provider>
}
