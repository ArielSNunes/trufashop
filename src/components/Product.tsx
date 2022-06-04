import Image from "next/image"
import { CartItem, useCart } from "../context/CartContext"
import { Product } from "../customTypes/Product"

type ComponentProps = {
	product: Product
}

const ProductComponent = ({ product }: ComponentProps) => {
	const cart = useCart()
	const add = () => cart.addToCart({ id: product.id, quantity: 1 })

	return (
		<div className="bg-white font-semibold text-center rounded-3xl border shadow-lg p-10 max-w-xs w-72">
			<div className='rounded-xl border border-black mb-3'>
				<Image src={product.image.url} width={150} height={150} className='mb-3 w-24 h-24 rounded-full mx-auto block' />
			</div>
			<h1 className="text-lg text-gray-700">
				{product.name}
			</h1>
			<h3 className="text-sm text-gray-400 ">
				{Intl.NumberFormat('pr-br', { currency: 'BRL', style: 'currency' }).format(product.price)}
			</h3>
			<div>
				<button className="bg-indigo-600 px-8 py-2 mt-8 rounded-3xl text-gray-100 font-semibold tracking-wide block w-full" onClick={add}>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
						<path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
					</svg>
				</button>
			</div>
		</div>
	)
}

export default ProductComponent