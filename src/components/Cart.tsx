import axios from "axios"
import { useFormik } from "formik"
import { useEffect, useState } from "react"
import { useCart } from "../context/CartContext"
import { Product } from "../customTypes/Product"
import CartItem from "./CartItem"

type FormProps = {
	cpf: string
	nome: string,
	telefone: string,
	products: Array<{ item: string; qtd: number }>
}
const Cart = () => {
	const cart = useCart()
	const [productList, setProductList] = useState<Product[]>([])
	const cartItemsKeys = Object.keys(cart.cart).map((key: string) => {
		return (cart.cart as { [key: string]: number })[key]
	})
	const cartItemsCount = cartItemsKeys.reduce((prev, curr) => {
		return prev + curr
	}, 0)

	const cartItemsPrice = Object.values(productList).map((product) => {
		const localQtd = (cart.cart as { [key: string]: number })[product.id]
		return {
			price: product.price,
			key: product.id,
			name: product.name,
			qtd: localQtd ? localQtd : 0,
			total: localQtd ? localQtd * product.price : 0
		}
	})
	const cartItemsPriceTotal = cartItemsPrice.reduce((prev, curr) => prev + curr.total, 0)
	const formikForm = useFormik<FormProps>({
		initialValues: {
			cpf: '',
			nome: '',
			telefone: '',
			products: []
		},
		onSubmit: async (values) => {
			const products = cartItemsPrice.filter(prod => {
				return prod.qtd > 0
			}).map(prod => ({
				...prod,
				price: prod.price.toFixed(2),
				total: prod.total.toFixed(2),
				orderTotal: cartItemsPriceTotal.toFixed(2)
			}))

			const result = await axios.post(
				'http://localhost:3001/orders',
				{
					...values,
					products
				}
			)
		}
	})

	useEffect(() => {
		const products = window.sessionStorage.getItem('products')
		if (products !== null) setProductList(JSON.parse(products))
	}, [])

	return (
		<div className="flex justify-center my-6">
			<div className="flex flex-col w-full p-8 text-gray-800 bg-white shadow-lg pin-r pin-y md:w-4/5 lg:w-4/5">
				<div className="flex-1">
					<table className="w-full text-sm lg:text-base" cellSpacing="0">
						<thead>
							<tr className="h-12 uppercase">
								<th className="hidden md:table-cell"></th>
								<th className="text-left">Produto</th>
								<th className="lg:text-right text-left pl-5 lg:pl-0">
									<span className="lg:hidden" title="Quantidade">Qtd</span>
									<span className="hidden lg:inline">Quantidade</span>
								</th>
								<th className="hidden text-right md:table-cell">Preço Unitário</th>
								<th className="text-right">Preço Total</th>
							</tr>
						</thead>
						<tbody>
							{Object.keys(cart.cart).map(key => {
								const thisProduct = productList.filter(prod => prod.id === key)[0]
								const qtdItem = cart.cart[key]

								if (!thisProduct) return
								return (
									<CartItem product={thisProduct} qtdItem={qtdItem} key={key} />
								)
							})}

						</tbody>
					</table>
					<hr className="pb-6 mt-6" />
					<div className="my-4 mt-6 -mx-2 lg:flex">
						<div className="lg:px-2 lg:w-1/2">
							<div className="p-4 bg-gray-100 rounded-full">
								<h1 className="ml-2 font-bold uppercase">Seus dados</h1>
							</div>
							<div className="p-4">
								<p className="mb-4 italic">Por favor, informe seus dados abaixo para concluir</p>
								<div className="w-full">
									<form action="" method="POST" onSubmit={formikForm.handleSubmit}>
										<div className="flex w-full h-13 pl-3 items-center mb-3">
											<label className="w-1/5" htmlFor="">Seu nome</label>
											<input
												type="text"
												name="nome"
												id="nome"
												placeholder="Digite seu nome"
												onChange={formikForm.handleChange}
												className="px-3 py-2 w-4/5 outline-none appearance-none bg-gray-100 focus:outline-none active:outline-none border rounded-full"
												value={formikForm.values.nome}
											/>
										</div>
										<div className="flex w-full h-13 pl-3 items-center mb-3">
											<label className="w-1/5" htmlFor="">Seu CPF</label>
											<input
												type="text"
												name="cpf"
												id="cpf"
												placeholder="Digite seu cpf"
												onChange={formikForm.handleChange}
												className="px-3 py-2 w-4/5 outline-none appearance-none bg-gray-100 focus:outline-none active:outline-none border rounded-full"
												value={formikForm.values.cpf}
											/>
										</div>
										<div className="flex w-full h-13 pl-3 items-center mb-3">
											<label className="w-1/5" htmlFor="">Seu WhatsApp</label>
											<input
												type="text"
												name="telefone"
												id="telefone"
												placeholder="Digite seu WhatsApp"
												onChange={formikForm.handleChange}
												className="px-3 py-2 w-4/5 outline-none appearance-none bg-gray-100 focus:outline-none active:outline-none border rounded-full"
												value={formikForm.values.telefone}
											/>
										</div>
										<div className="flex w-full h-13 pl-3 items-center mb-3">
											<button className="flex justify-center w-full px-10 py-3 mt-6 font-medium text-white uppercase bg-gray-800 rounded-full shadow item-center hover:bg-gray-700 focus:shadow-outline focus:outline-none">
												<svg aria-hidden="true" data-prefix="far" data-icon="credit-card" className="w-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M527.9 32H48.1C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48.1 48h479.8c26.6 0 48.1-21.5 48.1-48V80c0-26.5-21.5-48-48.1-48zM54.1 80h467.8c3.3 0 6 2.7 6 6v42H48.1V86c0-3.3 2.7-6 6-6zm467.8 352H54.1c-3.3 0-6-2.7-6-6V256h479.8v170c0 3.3-2.7 6-6 6zM192 332v40c0 6.6-5.4 12-12 12h-72c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h72c6.6 0 12 5.4 12 12zm192 0v40c0 6.6-5.4 12-12 12H236c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h136c6.6 0 12 5.4 12 12z" /></svg>
												<span className="ml-2 mt-5px">Concluir pedido</span>
											</button>
										</div>


									</form>
								</div>
							</div>
						</div>
						<div className="lg:px-2 lg:w-1/2">
							<div className="p-4 bg-gray-100 rounded-full">
								<h1 className="ml-2 font-bold uppercase">Seu pedido</h1>
							</div>
							<div className="p-4">
								<p className="mb-6 italic"></p>
								<div className="flex justify-between border-b">
									<div className="lg:px-4 lg:py-2 m-2 text-lg lg:text-xl font-bold text-center text-gray-800">
										Quantidade de produtos
									</div>
									<div className="lg:px-4 lg:py-2 m-2 lg:text-lg font-bold text-center text-gray-900">
										{cartItemsCount}
									</div>
								</div>
								<div className="flex justify-between pt-4 border-b">
									<div className="lg:px-4 lg:py-2 m-2 text-lg lg:text-xl font-bold text-center text-gray-800">
										Total
									</div>
									<div className="lg:px-4 lg:py-2 m-2 lg:text-lg font-bold text-center text-gray-900">
										{Intl.NumberFormat('pr-br', { currency: 'BRL', style: 'currency' }).format(cartItemsPriceTotal)}
									</div>
								</div>
								<a href="#">
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Cart