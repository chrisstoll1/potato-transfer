import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { setTurnCredentials } from '../../../coturn'

const turnHost = process.env.TURN_HOST || '127.0.0.1'
const stunServer = process.env.STUN_SERVER || 'stun:stun.l.google.com:19302'
const peerjsHost = process.env.PEERJS_HOST || '0.peerjs.com'
const peerjsPath = process.env.PEERJS_PATH || '/'
const turnUrls = process.env.TURN_URLS
  ? process.env.TURN_URLS.split(',')
      .map((url) => url.trim())
      .filter(Boolean)
  : [
      `turn:${turnHost}:3478?transport=udp`,
      `turn:${turnHost}:3478?transport=tcp`,
    ]

export async function POST(): Promise<NextResponse> {
  if (process.env.COTURN_ENABLED !== 'true') {
    return NextResponse.json({
      host: peerjsHost,
      path: peerjsPath,
      iceServers: [{ urls: stunServer }],
    })
  }

  // Generate ephemeral credentials
  const username = crypto.randomBytes(8).toString('hex')
  const password = crypto.randomBytes(8).toString('hex')
  const ttl = 86400 // 24 hours

  // Store credentials in Redis
  await setTurnCredentials(username, password, ttl)

  return NextResponse.json({
    host: peerjsHost,
    path: peerjsPath,
    iceServers: [
      { urls: stunServer },
      {
        urls: turnUrls,
        username,
        credential: password,
      },
    ],
  })
}
