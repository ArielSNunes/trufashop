import type { GetServerSideProps, NextPage } from 'next'
import * as prismic from '@prismicio/client'
import { Product } from '../customTypes/Product'
import Image from 'next/image'
import Link from 'next/link'

type PageProps = {
	products: Product[]
}
const CartIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
		<path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
	</svg>
)
const Home: NextPage<PageProps> = ({ products }) => {
	return (
		<div className=''>
			<nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5">
				<div className="container flex flex-wrap justify-center md:justify-between items-center mx-auto">
					<Link href="/" className="flex items-center w-full">
						<img src="/logo.png" className="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
					</Link>
					<div className="justify-between items-center w-full md:flex md:w-auto md:order-1" id="mobile-menu-4">
						<ul className="flex flex-row justify-center mt-6 md:mt-0 items-center space-x-8 text-sm font-medium">
							<li>
								<a href="#" className="block py-2 pr-4 pl-3 rounded bg-transparent text-blue-700 md:p-0" aria-current="page">
									Home
								</a>
							</li>
							<li>
								<a href="#" className="block py-2 pr-4 pl-3 rounded bg-transparent text-gray-500 md:p-0" aria-current="page">
									Contato
								</a>
							</li>
							<li>
								<button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Carrinho</button>
							</li>
						</ul>
					</div>
				</div>
			</nav>
			<div className="flex items-center justify-center h-screen gap-3 flex-wrap">
				{products.map((product, i) => {
					return (
						<div key={i} className="bg-white font-semibold text-center rounded-3xl border shadow-lg p-10 max-w-xs w-72">
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
								<button className="bg-indigo-600 px-8 py-2 mt-8 rounded-3xl text-gray-100 font-semibold tracking-wide block w-full">
									<CartIcon />
								</button>
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
