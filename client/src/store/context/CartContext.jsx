import { createContext, useContext, useReducer, useEffect, useMemo } from 'react'
import { siteData } from '../../data/siteData'
import { useStore } from './StoreContext'

const CartContext = createContext()

const STORAGE_KEY = siteData.cart.persistenceKey || 'appresuelve-cart'

function modifiersHash(modifiers) {
  return modifiers.map(m => m.id).sort().join(',')
}

function serviceItemKey(serviceId, variantId, modifiers) {
  return `svc-${serviceId}-${variantId}-${modifiersHash(modifiers)}`
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const quantityToAdd = action.payload.quantity || 1
      const existingIndex = state.items.findIndex(
        (item) => item.type === 'product' && item.productId === action.payload.productId
      )

      if (existingIndex >= 0) {
        const newItems = [...state.items]
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + quantityToAdd,
        }
        return { ...state, items: newItems }
      }

      return {
        ...state,
        items: [
          ...state.items,
          { type: 'product', productId: action.payload.productId, quantity: quantityToAdd },
        ],
      }
    }

    case 'ADD_SERVICE_ITEM': {
      const { serviceId, serviceSlug, serviceName, variantId, variantName, variantPrice, selectedModifiers, quantity } = action.payload
      const key = serviceItemKey(serviceId, variantId, selectedModifiers)
      const existingIndex = state.items.findIndex(
        (item) => item.type === 'service' && item.key === key
      )

      if (existingIndex >= 0) {
        const newItems = [...state.items]
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + quantity,
        }
        return { ...state, items: newItems }
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            type: 'service',
            key,
            serviceId,
            serviceSlug,
            serviceName,
            variantId,
            variantName,
            variantPrice,
            selectedModifiers,
            quantity,
          },
        ],
      }
    }

    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter((item) => {
          if (item.type === 'product') return item.productId !== action.payload.id
          if (item.type === 'service') return item.key !== action.payload.id
          return true
        }),
      }
    }

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => {
            if (item.type === 'product') return item.productId !== action.payload.id
            if (item.type === 'service') return item.key !== action.payload.id
            return true
          }),
        }
      }

      return {
        ...state,
        items: state.items.map((item) => {
          const itemId = item.type === 'product' ? item.productId : item.key
          if (itemId === action.payload.id) {
            return { ...item, quantity: action.payload.quantity }
          }
          return item
        }),
      }
    }

    case 'CLEAR_CART':
      return { ...state, items: [] }

    default:
      return state
  }
}

export function CartProvider({ children }) {
  const { productsMap, loading } = useStore()

  const [state, dispatch] = useReducer(cartReducer, undefined, () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const parsed = stored ? JSON.parse(stored) : []
      return { items: parsed }
    } catch {
      return { items: [] }
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
  }, [state.items])

  const cartItems = useMemo(() => {
    return state.items.map((item) => {
      if (item.type === 'product') {
        const product = productsMap[item.productId]
        if (!product) {
          return {
            type: 'product',
            id: item.productId,
            productId: item.productId,
            name: loading ? 'Cargando...' : 'Producto',
            images: [],
            retailPrice: 0,
            quantity: item.quantity,
            unitPrice: 0,
            subtotal: 0,
          }
        }

        const hasWholesale = product.wholesalePrice && product.wholesaleMinQty
        const usesWholesale = hasWholesale && item.quantity >= product.wholesaleMinQty
        const unitPrice = usesWholesale ? product.wholesalePrice : product.retailPrice

        return {
          type: 'product',
          ...product,
          quantity: item.quantity,
          unitPrice: Number(unitPrice),
          subtotal: Number(unitPrice) * item.quantity,
        }
      }

      if (item.type === 'service') {
        const modifiersTotal = (item.selectedModifiers || []).reduce((sum, m) => sum + Number(m.price), 0)
        const unitPrice = item.variantPrice + modifiersTotal
        return {
          type: 'service',
          id: item.key,
          key: item.key,
          serviceId: item.serviceId,
          serviceSlug: item.serviceSlug,
          serviceName: item.serviceName,
          variantId: item.variantId,
          variantName: item.variantName,
          variantPrice: item.variantPrice,
          selectedModifiers: item.selectedModifiers || [],
          quantity: item.quantity,
          unitPrice,
          subtotal: unitPrice * item.quantity,
        }
      }

      return item
    })
  }, [state.items, productsMap, loading])

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)

  const totalPrice = cartItems.reduce((sum, item) => sum + item.subtotal, 0)

  const addItem = (productId, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { productId, quantity } })
  }

  const addServiceItem = (serviceData) => {
    dispatch({ type: 'ADD_SERVICE_ITEM', payload: serviceData })
  }

  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } })
  }

  const updateQuantity = (id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const getItemQuantity = (productId) => {
    const item = state.items.find(
      (item) => item.type === 'product' && item.productId === productId
    )
    return item ? item.quantity : 0
  }

  const value = {
    items: cartItems,
    totalItems,
    totalPrice,
    addItem,
    addServiceItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider')
  }
  return context
}
