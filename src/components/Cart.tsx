import axios from "axios"
import { useFormik } from "formik"
import { useEffect, useState } from "react"
import { useCart } from "../context/CartContext"
import { OrderStatus } from "../customTypes/OrderStatus"
import { Product } from "../customTypes/Product"
import CartForm from "./CartForm"
import CartItem from "./CartItem"

type FormProps = {
	cpf: string
	nome: string,
	telefone: string,
	products: Array<{ item: string; qtd: number }>
}
type ComponentProps = {
	orderStatus: OrderStatus
	setOrderStatus: (newStatus: OrderStatus) => void
}
const Cart = ({ orderStatus, setOrderStatus }: ComponentProps) => {
	const cart = useCart()
	const [productList, setProductList] = useState<Product[]>([])
	const cartItemsKeys = Object.keys(cart.cart).map((key: string) => {
		return (cart.cart as { [key: string]: number })[key]
	})
	const [qrCode, setQrCode] = useState<null | { qrcode: string, imagemQrcode: string }>(null)
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

			setOrderStatus(OrderStatus.PEDIDO_RECEBIDO)
			const result = await axios.post(
				'http://localhost:3001/orders',
				{
					...values,
					products
				}
			)
			setOrderStatus(OrderStatus.AGUARDANDO_PAGAMENTO)
			setQrCode(result.data.qrcode)
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
								<div className="w-full">
									{orderStatus === OrderStatus.PENDENTE &&
										<CartForm formikForm={formikForm} />
									}
									{orderStatus === OrderStatus.PEDIDO_RECEBIDO &&
										<p>Pedido sendo realizado, por favor, aguarde</p>
									}
									{orderStatus === OrderStatus.AGUARDANDO_PAGAMENTO &&
										<div className="overflow-auto break-words">
											<p>
												Chave pix:
												<br />
												<span className="font-medium">
													{qrCode?.qrcode}
												</span>
											</p>
											<p className="mt-6">QRCode:</p>
											<div className="flex justify-start">
												<img className="d-block" src={qrCode?.imagemQrcode} />
											</div>
										</div>
									}
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