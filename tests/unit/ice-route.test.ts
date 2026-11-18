import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../src/coturn', () => ({
  setTurnCredentials: vi.fn().mockResolvedValue(undefined),
}))

afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})

describe('ICE configuration', () => {
  it('advertises UDP and TCP TURN without an unconfigured TLS endpoint', async () => {
    vi.stubEnv('COTURN_ENABLED', 'true')
    vi.stubEnv('TURN_HOST', '203.0.113.8')
    vi.stubEnv('TURN_URLS', '')
    const { POST } = await import('../../src/app/api/ice/route')
    const response = await POST()
    const data = await response.json()
    expect(data.iceServers[1].urls).toEqual([
      'turn:203.0.113.8:3478?transport=udp',
      'turn:203.0.113.8:3478?transport=tcp',
    ])
    expect(data.iceServers[1].username).toBeTruthy()
    expect(data.iceServers[1].credential).toBeTruthy()
  })

  it('accepts explicitly configured relay URLs', async () => {
    vi.stubEnv('COTURN_ENABLED', 'true')
    vi.stubEnv('TURN_URLS', 'turns:relay.example.com:5349?transport=tcp')
    const { POST } = await import('../../src/app/api/ice/route')
    const data = await (await POST()).json()
    expect(data.iceServers[1].urls).toEqual([
      'turns:relay.example.com:5349?transport=tcp',
    ])
  })

  it('does not issue relay credentials when TURN is disabled', async () => {
    vi.stubEnv('COTURN_ENABLED', 'false')
    const { POST } = await import('../../src/app/api/ice/route')
    const data = await (await POST()).json()
    expect(data.iceServers).toHaveLength(1)
    expect(data.iceServers[0].urls).toMatch(/^stun:/)
  })
})
