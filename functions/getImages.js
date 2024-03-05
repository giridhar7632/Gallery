export async function onRequest({ env }) {
	const url = `https://api.cloudinary.com/v1_1/${env.CLOUD_NAME}/resources/image`
	const res = await fetch(url, {
		headers: {
			Authorization: `Basic ${env.AUTH_HEADER}`,
		},
	})

	const { resources } = await res.json()
	const data = resources.map((i) => {
		return {
			id: i.public_id,
			url: i.url,
		}
	})

	return new Response(data, {
		headers: {
			'content-type': 'application/json',
		},
	})
}
