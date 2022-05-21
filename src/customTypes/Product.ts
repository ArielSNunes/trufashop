export interface ProductImage {
	dimensions: {
		width: number
		height: number
	},
	url: string,
	thumb: ProductImage
}

export interface Product {
	price: number
	name: string
	image: ProductImage
}