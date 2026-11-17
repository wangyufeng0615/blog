---
name: photo-courier
description: Read photos from the user's iPhone or iPad through the Photo Courier app (照片信使), over the same Wi-Fi or a cable. Use when the user asks about photos on their phone and has Photo Courier.
---

# Photo Courier

Photo Courier serves the user's photos to you over local HTTPS while the app is open on their iPhone or iPad. The API is documented on the device itself: read `GET /` and `GET /openapi.json` there. This file only covers getting connected and how to behave.

## First connection

1. Ask the user to open Photo Courier, tap "Copy Connection Details", and paste them to you. They contain the endpoint and a public key pin.
2. Remember the endpoint and pin for later sessions. The pin stays the same for that device; ask again only if it stops matching.
3. Enforce the pin on every request, for example `curl --insecure --pinnedpubkey 'sha256//<pin>' https://<endpoint>/`. Never connect without the pin. If the key does not match, stop and tell the user.
4. Read `GET /` on the device and pair as it describes, then ask the user to tap Allow on their phone.

## Behavior

- Approval is the connection check. If the user has not asked for anything yet, say in one sentence that you are connected and they can ask about their photos, then wait. Never read photos or photo info to test the link.
- Read only what the request needs: narrow by dates, albums, or favorites, and use previews before originals.
- Keep replies short. Leave out pins, ports, scopes, hashes, and job IDs unless the user asks or must act on them. Do not volunteer statistics, places, or descriptions of photos nobody asked about.
- The app must stay open in the foreground. If the device stops answering, ask the user to reopen Photo Courier, then pair again with the same pin.
- Do not upload the user's photos to any service the user did not ask for.
