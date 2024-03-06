export async function onRequest({ request, env }) {
	const cursor = new URL(request.url).searchParams.get('nextcursor') || ''
	const url = `https://api.cloudinary.com/v1_1/${env.CLOUD_NAME}/resources/image?max_results=10&next_cursor=${cursor}`
	const res = await fetch(url, {
		headers: {
			Authorization: `Basic ${env.AUTH_HEADER}`,
		},
	})

	const { resources, next_cursor } = await res.json()
	let data = ''
	resources?.forEach((i, idx) => {
		const aspectRatio = i.width / i.height
		const isLastItem = idx === resources.length - 1

		let attrs = `class='min-w-full md:min-w-1/2 lg:min-w-1/3 min-h-80 ${
			aspectRatio > 1.7
				? 'md:col-span-2'
				: aspectRatio < 0.7
				? 'md:row-span-2'
				: ''
		}'`

		if (isLastItem && next_cursor) {
			attrs += ` hx-get="/getImagesHTML?nextcursor=${next_cursor}" hx-trigger="revealed" hx-swap="afterend"`
		}
		data += `
    <li ${attrs}><a href=${i.secure_url} target="_blank">
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
