import { baseURL, sub } from '$lib/info'
import { proxifyImage } from '$lib/utils'
import { json } from '@sveltejs/kit'

export async function GET({ url }) {
    const resp = await fetch(baseURL + sub.topCharts, {
        method: 'GET',
        headers: {
            cookie: 'L=english; gdpr_acceptance=true; DL=english'
        }
    })
    const data = await resp.json()

    await data.forEach((res) => {
		res.image = proxifyImage(res.image)
	})

    return json({
        "results": data
    })
}