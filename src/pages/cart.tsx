import type { GetServerSideProps, NextPage } from 'next'
import * as prismic from '@prismicio/client'
import { Fragment, useState } from 'react'

import { Product } from '../customTypes/Product'
import Navbar from '../components/Navbar'
import Cart from '../components/Cart'
import { OrderStatus } from '../customTypes/OrderStatus'

type PageProps = {
	products: Product[]
}
const CartPage: NextPage<PageProps> = ({ products }) => {
	const [orderStatus, setOrderStatus] = useState(OrderStatus.PENDENTE)

	return (
		<Fragment>
			<Navbar page='Carrinho' />
			<Cart orderStatus={orderStatus} setOrderStatus={setOrderStatus} />
		</Fragment>
	)
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
	const client = prismic.createClient('https://trufashop-arielsn.prismic.io/api/v2')
	const products = await client.getByType('product')
	return {
		props: {
			products: products.results.map(product => ({
				...product.data,
				id: product.id
			}))
		}
	}
}

export default CartPage
