export interface ProductImage {
	dimensions: {
		width: number
		height: number
	},
	url: string,
	thumb: ProductImage
}

export interface Product {
	id: string
	price: number
	name: string
	image: ProductImage
}