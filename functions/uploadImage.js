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
	const aspectRatio = data.width / data.height
	const image = {
		id: data.public_id,
		url: data.secure_url,
		class:
			aspectRatio > 1.7
				? 'md:col-span-2'
				: aspectRatio < 0.7
				? 'md:row-span-2'
				: '',
	}

	if (data.error) {
		return Response.json({
			id: data.error.message,
			url: 'https://raw.githubusercontent.com/giridhar7632/Gallery/main/error.gif',
		})
	} else {
		return Response.json(image)
	}
}
