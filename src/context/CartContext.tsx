import React, { createContext, FC, useContext, useEffect, useState } from "react"
import { Product } from "../customTypes/Product"

export type CartItem = {
	id: string,
	quantity: number
}
export type CartContextType = {
	cart: { [key: string]: number },
	addToCart: (product: CartItem) => void,
	removeFromCart: (productId: string) => void,
	updateQuantity: (productId: string, newQuantity: number) => void
}
export type CartProviderProps = {
	children: React.ReactNode
}

export const CartContext = createContext<CartContextType>({
	cart: {},
	addToCart: () => { },
	removeFromCart: () => { },
	updateQuantity: () => { }
})

export const CartProvider: FC<CartProviderProps> = ({ children }) => {
	const [cart, setCart] = useState<{ [key: string]: number }>({})
	useEffect(() => {
		const sessionCart = window.sessionStorage.getItem('cart')
		if (sessionCart) {
			setCart(JSON.parse(sessionCart))
		}
	}, [])
	const addToCart = (product: CartItem) => {
		if (product.id) {
			const { id } = product

			setCart(old => {
				const newCart = {
					...old,
					[id]: old[id] ? old[id] + 1 : 1
				}
				window.sessionStorage.setItem('cart', JSON.stringify(newCart))
				return newCart
			})
		}
	}
	const removeFromCart = (productId: string) => {
		setCart(old => {
			const newCart: { [key: string]: number } = {}
			Object.keys(old).forEach(key => {
				if (productId !== key) {
					newCart[key] = old[key]
				}
			})
			window.sessionStorage.setItem('cart', JSON.stringify(newCart))
			return newCart
		})
	}
	const updateQuantity = (productId: string, newQuantity: number) => {
		if (newQuantity <= 0) {
			removeFromCart(productId)
		} else {
			setCart(old => {
				const newCart = { ...old }
				if (old[productId]) {
					old[productId] = newQuantity
				}
				window.sessionStorage.setItem('cart', JSON.stringify(newCart))
				return newCart
			})
		}
	}
	return (
		<CartContext.Provider value={{
			cart,
			addToCart,
			removeFromCart,
			updateQuantity
		}}>
			{children}
		</CartContext.Provider>
	)
}

export const useCart = () => {
	const cart = useContext(CartContext)
	return cart
}