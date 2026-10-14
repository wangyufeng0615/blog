# Browser libraries

These pinned browser distributions are served from the blog's own origin. Builds
do not download or execute a CDN's current package version. `manifest.json`
records upstream package versions, file sizes and SHA-256 checksums; the output
check verifies those checksums before deployment.

- MapLibre GL JS 5.12.0: BSD-3-Clause; included LICENSE.txt.
- Three.js 0.160.0: MIT; included LICENSE.
- MediaPipe Hands 0.4.1675469240 and Camera Utils 0.3.1675466862:
  Apache-2.0; upstream notices in the distributions are retained.

Files were obtained from the corresponding versioned npm distributions through
jsDelivr. To update, retrieve the exact upstream version, retain its notices,
refresh the manifest and validate the map/WebAR page. MediaPipe's model/WASM
downloads still use its versioned external locateFile URL. ArcGIS imagery is
also external; neither service is mirrored here.
