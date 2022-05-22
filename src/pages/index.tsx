import type { GetServerSideProps, NextPage } from 'next'
import * as prismic from '@prismicio/client'
import { Product } from '../customTypes/Product'
import Navbar from '../components/Navbar'
import ProductComponent from '../components/Product'

type PageProps = {
	products: Product[]
}
const Home: NextPage<PageProps> = ({ products }) => {
	return (
		<div className=''>
			<Navbar />
			<div className="flex items-center justify-center h-screen gap-3 flex-wrap">
				{products.map((product, i) => <ProductComponent key={i} product={product} />)}
			</div>
		</div>
	)
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
	const client = prismic.createClient('https://trufashop-arielsn.prismic.io/api/v2')
	const products = await client.getByType('product')
	return {
		props: {
			products: products.results.map(product => product.data)
		}
	}
}

export default Home
