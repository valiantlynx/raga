import { baseURL, sub } from '$lib/info'
import { proxifyImage } from '$lib/utils'
import { json } from '@sveltejs/kit'

export async function GET({ url, fetch }) {
    const query = url.searchParams.get('q')
    const resp = await fetch(baseURL + 'n=20' + sub.search.albums + query)
    const data = await resp.json()
    const results = await data.results

    await results.forEach((res) => {
        res.image = proxifyImage(res.image, 150)
	})

    return json({
        'results': results
    })
}