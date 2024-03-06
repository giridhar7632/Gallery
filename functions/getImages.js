export async function onRequest({ env }) {
	const url = `https://api.cloudinary.com/v1_1/${env.CLOUD_NAME}/resources/image`
	const res = await fetch(url, {
		headers: {
			Authorization: `Basic ${env.AUTH_HEADER}`,
		},
	})

	const { resources } = await res.json()
	const data = resources.map((i) => {
		const aspectRatio = i.width / i.height
		return {
			id: i.public_id,
			url: i.secure_url,
			class:
				aspectRatio > 1.7
					? 'md:col-span-2'
					: aspectRatio < 0.6
					? 'md:row-span-2'
					: '',
		}
	})

	return Response.json(data)
}
