export async function onRequest({ request, env }) {
	const formData = await request.formData()
	formData.append('upload_preset', env.CLOUDINARY_UPLOAD_PRESET)

	const url = `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`

	const res = await fetch(url, {
		method: 'POST',
		body: formData,
	})
	const data = await res.json()

	if (data.error) {
		return new Response(data.error.message, {
			status: 400,
		})
	} else {
		const aspectRatio = data.width / data.height

		return new Response(`
    <li class='min-w-full md:min-w-1/2 lg:min-w-1/3 min-h-80 ${
			aspectRatio > 1.7
				? 'md:col-span-2'
				: aspectRatio < 0.7
				? 'md:row-span-2'
				: ''
		}'><a href=${data.secure_url} target="_blank">
    <img
			id=${data.public_id}
			src=${data.secure_url}
      alt=${data.public_id}
      class='w-full h-full object-cover rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition duration-300 ease-in-out'
		/>
    </a>
    </li>`)
	}
}
