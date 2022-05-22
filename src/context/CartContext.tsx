import React, { createContext, FC, useContext, useEffect, useState } from "react"
import { Product } from "../customTypes/Product"

export type CartItem = {
	id: string,
	quantity: number
}
export type CartContextType = {
	cart: {},
	addToCart: (product: CartItem) => void
}
export type CartProviderProps = {
	children: React.ReactNode
}

export const CartContext = createContext<CartContextType>({
	cart: {},
	addToCart: () => { }
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
	return (
		<CartContext.Provider value={{ cart, addToCart }}>
			{children}
		</CartContext.Provider>
	)
}

export const useCart = () => {
	const cart = useContext(CartContext)
	return cart
}