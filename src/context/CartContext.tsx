import React, { createContext, FC, useContext, useState } from "react"

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
	const addToCart = (product: CartItem) => {
		if (product.id) {
			const { id } = product
			setCart(old => ({
				...old,
				[id]: old[id] ? old[id] + 1 : 1
			}))
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