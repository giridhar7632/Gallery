import { Buffer } from 'node:buffer'

export async function onRequest({ request, env }) {
	const cursor = new URL(request.url).searchParams.get('nextcursor') || ''
	const url = `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/resources/image?next_cursor=${cursor}`
	const res = await fetch(url, {
		headers: {
			Authorization: `Basic ${Buffer.from(
				env.CLOUDINARY_API_KEY + ':' + env.CLOUDINARY_API_SECRET
			).toString('base64')}`,
		},
	})

	const { resources, next_cursor } = await res.json()
	const data = resources.map((i, idx) => {
		const aspectRatio = i.width / i.height
		const attrs =
			idx === resources.length - 1 && next_cursor
				? `hx-get="/getImages?nextcursor=${next_cursor}" hx-trigger="revealed" hx-swap="afterend"`
				: null
		return {
			id: i.public_id,
			url: i.secure_url,
			attrs,
			class:
				aspectRatio > 1.7
					? 'md:col-span-2'
					: aspectRatio < 0.7
					? 'md:row-span-2'
					: '',
		}
	})

	return Response.json(data)
}
