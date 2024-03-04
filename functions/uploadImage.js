export async function onRequest({ request, env }) {
	const formData = await request.formData()
	console.log({ env })

	const url = `https://api.cloudinary.com/v1_1/${env.CLOUD_NAME}/image/upload`
	console.log('uploading image')
	const newformData = new FormData()
	newformData.append('file', formData.get('file'))
	newformData.append('upload_preset', env.UPLOAD_PRESET)

	const res = await fetch(url, {
		method: 'POST',
		body: newformData,
		headers: {
			Authorization: `Basic ${env.AUTH_HEADER}`,
		},
	})
	console.log('image uploaded')

	const data = await res.json()

	console.log({ data })
	// const data = res.body.resources.map((i) => {
	// 	return {
	// 		id: i.public_id,
	// 		url: i.url,
	// 	}
	// })
	return new Response('uploaded')
}
