import { createContext, useContext, useState, useEffect } from 'react'
import { settingsService, categoriesService, productsService } from '../../services/storeService'

const StoreContext = createContext()

export function StoreProvider({ children }) {
  const [store, setStore] = useState(null)
  const [categories, setCategories] = useState([])
  const [productsMap, setProductsMap] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const settings = await settingsService.get()
        setStore(settings)

        const status = settings.store_status || 'active'
        if (status !== 'active') {
          console.log('[STORE] store not active — status:', settings.store_status)
          setCategories([])
          setProductsMap({})
          return
        }

        console.log('[STORE] store active — loading products...')

        const [cats, prods] = await Promise.all([
          categoriesService.list(),
          productsService.list({ limit: 1000 }),
        ])

        setCategories(cats)

        const map = {}
        prods.products.forEach((p) => {
          map[p.id] = p
        })
        setProductsMap(map)
        console.log('[STORE] productsMap loaded — products:', prods.products.length, 'map keys:', Object.keys(map).length)
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return (
    <StoreContext.Provider value={{ store, categories, productsMap, loading }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore debe usarse dentro de StoreProvider')
  return ctx
}
