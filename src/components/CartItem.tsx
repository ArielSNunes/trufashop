import Image from "next/image"
import { ChangeEvent, useState } from "react"
import { useCart } from "../context/CartContext"
import { Product } from "../customTypes/Product"

type ComponentProps = { product: Product, qtdItem: number }
const CartItem = ({ product, qtdItem }: ComponentProps) => {
	const [quantity, setQuantity] = useState(qtdItem)
	const cart = useCart()
	const remove = () => cart.removeFromCart(product.id)
	const updateQuantity = (e: ChangeEvent<HTMLInputElement>) => {
		const newQuantity = parseInt(e.currentTarget.value)
		setQuantity(newQuantity)
		update(newQuantity)
	}
	const update = (quantity: number) => cart.updateQuantity(product.id, quantity)
	return (
		<tr>
			<td className="hidden pb-4 md:table-cell">
				<Image src={product.image.thumb.url} {...product.image.thumb.dimensions} className="w-20 rounded" alt={product.name} />
			</td>
			<td>
				<p className="mb-2 md:ml-4">
					{product.name}
				</p>
				<button type="submit" className="text-gray-700 md:ml-4" onClick={remove}>
					<small>(Remover item)</small>
				</button>
			</td>
			<td className="justify-center md:justify-end md:flex mt-6">
				<div className="w-20 h-10">
					<div className="relative flex flex-row w-full h-8">
						<input
							type="number"
							value={quantity}
							onChange={updateQuantity}
							onInput={updateQuantity}
							className="w-full font-semibold text-center text-gray-700 bg-gray-200 outline-none focus:outline-none hover:text-black focus:text-black" />
					</div>
				</div>
			</td>
			<td className="hidden text-right md:table-cell">
				<span className="text-sm lg:text-base font-medium">
					{Intl.NumberFormat('pr-br', { currency: 'BRL', style: 'currency' }).format(product.price)}
				</span>
			</td>
			<td className="text-right">
				<span className="text-sm lg:text-base font-medium">
					{Intl.NumberFormat('pr-br', { currency: 'BRL', style: 'currency' }).format(product.price * quantity)}
				</span>
			</td>
		</tr>
	)
}
export default CartItem