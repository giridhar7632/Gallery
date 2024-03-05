export async function onRequest({ request, env }) {
	const formData = await request.formData()

	const url = `https://api.cloudinary.com/v1_1/${env.CLOUD_NAME}/image/upload`
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
	const data = await res.json()

	if (data.error) {
		return new Response(data.error.message, {
			status: 400,
		})
	} else {
		return new Response('Uploaded! 🎉')
	}
}
