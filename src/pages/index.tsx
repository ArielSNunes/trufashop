import type { GetServerSideProps, NextPage } from 'next'
import * as prismic from '@prismicio/client'
import { Product } from '../customTypes/Product'
import Image from 'next/image'

type PageProps = {
	products: Product[]
}

const Home: NextPage<PageProps> = ({ products }) => {
	return (
		<div className=''>
			<div className="flex items-center justify-center h-screen gap-3 flex-wrap">
				{products.map((product, i) => {
					return (
						<div key={i} className="bg-white font-semibold text-center rounded-3xl border shadow-lg p-10 max-w-xs">
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
								<button className="bg-indigo-600 px-8 py-2 mt-8 rounded-3xl text-gray-100 font-semibold uppercase tracking-wide">
									Adicionar ao carrinho
								</button>
								
								<input type="number" name="" id="" min={0} max={99} value={1} className='w-full border border-indigo-600 rounded-2xl pl-3 mt-3' />
							</div>
						</div>
					)
				})}

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
