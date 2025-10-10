import { useEffect, useMemo, useSyncExternalStore } from 'react'
import { PostgrestQueryBuilder } from '@supabase/postgrest-js'
import { getSupabaseClient } from '@/lib/supabaseClient'

const supabase = getSupabaseClient()

type SupabaseSelectBuilder = ReturnType<
  PostgrestQueryBuilder<any, any, any>['select']
>

export type SupabaseQueryHandler = (
  query: SupabaseSelectBuilder,
) => SupabaseSelectBuilder

export interface UseInfiniteQueryProps {
  tableName: string
  columns?: string
  pageSize?: number
  trailingQuery?: SupabaseQueryHandler
}

interface StoreState<TData> {
  data: TData[]
  count: number
  isSuccess: boolean
  isLoading: boolean
  isFetching: boolean
  error: Error | null
  hasInitialFetch: boolean
}

type Listener = () => void

function createStore<TData = Record<string, any>>(
  props: UseInfiniteQueryProps,
) {
  const { tableName, columns = '*', pageSize = 20, trailingQuery } = props

  let state: StoreState<TData> = {
    data: [],
    count: 0,
    isSuccess: false,
    isLoading: false,
    isFetching: false,
    error: null,
    hasInitialFetch: false,
  }

  const listeners = new Set<Listener>()

  const notify = () => {
    listeners.forEach((listener) => listener())
  }

  const setState = (newState: Partial<StoreState<TData>>) => {
    state = { ...state, ...newState }
    notify()
  }

  const fetchPage = async (skip: number) => {
    if (
      state.hasInitialFetch &&
      (state.isFetching || (state.count > 0 && state.count <= state.data.length))
    ) {
      return
    }

    setState({ isFetching: true })

    let query = supabase
      .from(tableName)
      .select(columns, { count: 'exact' }) as unknown as SupabaseSelectBuilder

    if (trailingQuery) {
      query = trailingQuery(query)
    }

    const { data: newData, count, error } = await query.range(
      skip,
      skip + pageSize - 1,
    )

    if (error) {
      console.error('An unexpected error occurred:', error)
      setState({ error })
    } else {
      setState({
        data: [...state.data, ...((newData ?? []) as TData[])],
        count: count ?? state.count,
        isSuccess: true,
        error: null,
      })
    }

    setState({ isFetching: false })
  }

  const fetchNextPage = async () => {
    if (state.isFetching) return
    await fetchPage(state.data.length)
  }

  const initialize = async () => {
    setState({ isLoading: true, isSuccess: false, data: [], error: null })
    await fetchNextPage()
    setState({ isLoading: false, hasInitialFetch: true })
  }

  return {
    getState: () => state,
    subscribe: (listener: Listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    fetchNextPage,
    initialize,
  }
}

const initialState: StoreState<any> = {
  data: [],
  count: 0,
  isSuccess: false,
  isLoading: false,
  isFetching: false,
  error: null,
  hasInitialFetch: false,
}

export function useInfiniteQuery<TData = Record<string, any>>(
  props: UseInfiniteQueryProps,
) {
  const store = useMemo(() => createStore<TData>(props), [
    props.tableName,
    props.columns,
    props.pageSize,
    props.trailingQuery,
  ])

  const state = useSyncExternalStore(
    store.subscribe,
    () => store.getState(),
    () => initialState as StoreState<TData>,
  )

  useEffect(() => {
    if (!store.getState().hasInitialFetch && typeof window !== 'undefined') {
      void store.initialize()
    }
  }, [store])

  return {
    data: state.data,
    count: state.count,
    isSuccess: state.isSuccess,
    isLoading: state.isLoading,
    isFetching: state.isFetching,
    error: state.error,
    hasMore: state.count === 0 ? true : state.count > state.data.length,
    fetchNextPage: store.fetchNextPage,
  }
}
