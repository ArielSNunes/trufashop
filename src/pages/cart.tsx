import type { GetServerSideProps, NextPage } from 'next'
import * as prismic from '@prismicio/client'
import { Fragment } from 'react'

import { Product } from '../customTypes/Product'
import Navbar from '../components/Navbar'
import Cart from '../components/Cart'

type PageProps = {
	products: Product[]
}
const CartPage: NextPage<PageProps> = ({ products }) => {
	return (
		<Fragment>
			<Navbar page='Carrinho' />
			<Cart />
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
