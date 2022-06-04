import Head from "next/head";
import Link from "next/link"
import { Fragment } from "react";
import { CartItem, useCart } from "../context/CartContext"

type ComponentProps = {
	page?: string
}
const Navbar = ({ page }: ComponentProps) => {
	const cart = useCart()
	const cartItemsCount = Object.keys(cart.cart).map((key: string) => {
		return (cart.cart as { [key: string]: number })[key]
	}).reduce((prev, curr) => {
		return prev + curr
	}, 0);
	return (
		<Fragment>
			<Head>
				<title>
					TrufaShop {page && ` - ${page}`}
				</title>
			</Head>
			<nav className="bg-white border-gray-200 mb-3 md:mb-0 px-2 sm:px-4 py-2.5 border-b">
				<div className="container flex flex-wrap justify-center md:justify-between items-center mx-auto">
					<Link href="/" className="flex items-center w-full">
						<img src="/logo.png" className="mr-3 h-6 sm:h-9 cursor-pointer" alt="Flowbite Logo" />
					</Link>
					<div className="justify-between items-center w-full md:flex md:w-auto md:order-1" id="mobile-menu-4">
						<ul className="flex flex-row justify-center mt-6 md:mt-0 items-center space-x-8 text-sm font-medium">
							<li>
								<Link href="/" className="block py-2 pr-4 pl-3 rounded bg-transparent text-blue-700 md:p-0" aria-current="page">
									Home
								</Link>
							</li>
							<li>
								<Link href="/" className="block py-2 pr-4 pl-3 rounded bg-transparent text-gray-500 md:p-0" aria-current="page">
									Contato
								</Link>
							</li>
							<li>
								<Link href='/cart'>
									<button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
										Carrinho
										{cartItemsCount > 0 && (
											<span className="ml-2">
												({cartItemsCount})
											</span>
										)}
									</button>
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</nav>
		</Fragment>
	)
}
export default Navbar