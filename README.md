# Potato Transfer

Share a file directly from your computer with a browser link at **https://transfer.potato-server.net/**. Keep the sender's browser tab open and device awake until the transfer finishes. Files transfer over encrypted WebRTC; they are not stored on the web server.

## Development

Use Node.js 24 and pnpm 10.28.0:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Validate with `pnpm type:check`, `pnpm test`, and `pnpm build`.

## Deployment

Push to `main` to validate and publish `ghcr.io/chrisstoll1/potato-transfer`. The `Container` workflow tags each image with its full source commit as well as `latest`.

TrueNAS runs the web image and a separate PeerJS signaling service as Custom App `filepizza`. Update the web image only after the exact commit's Container workflow succeeds. Set `PEERJS_HOST=transfer.potato-server.net` and `PEERJS_PATH=/peerjs`; proxy `/peerjs` to the signaling service with WebSockets enabled. Image digests are pinned in production.

Direct connections use STUN. Enable the authenticated relay with `COTURN_ENABLED=true`, `TURN_HOST` set to the publicly reachable relay address, `TURN_REALM` matching coturn, and `REDIS_URL` pointing to the private credential store. The default relay URLs support both UDP and TCP on port 3478. Override `TURN_URLS` with comma-separated URLs when using custom ports or a configured TLS listener.

The TrueNAS deployment adds coturn and a private Valkey credential store to the existing app. pfSense forwards TCP/UDP 3478 and UDP 60000-60128 to 192.168.4.8. TURN traffic connects directly to the WAN address and bypasses the website reverse proxy. Direct peer-to-peer connections remain preferred; TURN is a fallback, with WebRTC data still encrypted.

## Upstream and license

This is a branded fork of [FilePizza](https://github.com/kern/filepizza) by Alex Kern and contributors. Copyright and BSD 3-Clause license notices are retained in [LICENSE](LICENSE) and included in the container image. The public interface uses Potato Transfer branding without the upstream terms or footer.
