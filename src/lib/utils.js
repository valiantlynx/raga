import { get } from 'svelte/store'
import { currentTime, index, currentPlaylist, paused, repeat, query, quality } from '$lib/store'
import { proxyURL, proxyEnabled } from '$lib/info'

import pkg from 'node-forge'
const { util, cipher } = pkg

const key = '38346591'
const iv = '00000000'

export const decrypt = (enc, kbps320) => {
  const encrypted = util.decode64(enc)
  const decipher = cipher.createDecipher('DES-ECB', util.createBuffer(key, 'utf8'))

  decipher.start({ iv: util.createBuffer(iv, 'utf8') })
  decipher.update(util.createBuffer(encrypted))
  decipher.finish()

  const dec = decipher.output.getBytes().replace("_96", get(quality))
  // const finalURL = kbps320 === "true" ? dec.replace('_96', '_320') : dec.replace('_96', '_160')
  return proxifyAudio(dec)
}

//////////////////////////////////////////////////////////////////

export function playToggle() { paused.update((p) => p = !p) }
export function repeatToggle() { repeat.update((r) => r = !r) }

export function back() {
  currentTime.set(0)

  if (get(index) !== 0) {
      index.update((n) => n - 1)
  } else {
      index.set(get(currentPlaylist).length - 1)
  }
}

export function next() {
  currentTime.set(0)
  if (get(index) !== get(currentPlaylist).length - 1) {
      index.update((n) => n + 1)
  } else {
      index.set(0)
  }
}

//////////////////////////////////////////////////////////////////

export const proxifyImage = (url, sizeOfImage) => {
  if (proxyEnabled) {
    if (sizeOfImage === 150) {
      return url.replace('c.saavncdn.com', `${proxyURL}/media`).replace('150x150', '500x500')
    } else if (sizeOfImage === 50) {
      return url.replace('c.saavncdn.com', `${proxyURL}/media`).replace('50x50', '150x150')
    } else {
      return url.replace('c.saavncdn.com', `${proxyURL}/media`)
    }
  } else {
    if (sizeOfImage === 150) {
      return url.replace('150x150', '500x500')
    } else if (sizeOfImage === 50) {
      return url.replace('50x50', '150x150')
    } else {
      return url
    }
  }
}

export const proxifyAudio = (url) => {
  if (proxyEnabled) {
    return url.replace('aac.saavncdn.com', `${proxyURL}/aac`)
  }
  
  return url
}

export const proxifyArtistImage = (url) => {
  if (proxyEnabled) {
    return url.replace('www.jiosaavn.com', `${proxyURL}/svg`).replace('50x50', '150x150')
  }
  
  return url.replace('50x50', '150x150')
}