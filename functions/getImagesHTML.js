export async function onRequest({ env }) {
	const url = `https://api.cloudinary.com/v1_1/${env.CLOUD_NAME}/resources/image`
	const res = await fetch(url, {
		headers: {
			Authorization: `Basic ${env.AUTH_HEADER}`,
		},
	})

	const { resources } = await res.json()
	let data = ''
	resources.forEach((i) => {
		const aspectRatio = i.width / i.height
		data += `
    <li class='min-w-full md:min-w-1/2 lg:min-w-1/3 min-h-80 ${
			aspectRatio > 1.7
				? 'md:col-span-2'
				: aspectRatio < 0.6
				? 'md:row-span-2'
				: ''
		}'><a href=${i.secure_url} target="_blank">
    <img
			id=${i.public_id}
			src=${i.secure_url}
      alt=${i.public_id}
      class='w-full h-full object-cover rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition duration-300 ease-in-out'
		/>
    </a>
    </li>`
	})

	return new Response(data, {
		headers: {
			'content-type': 'text/html',
		},
	})
}
