path="."

if [ "$(basename "$PWD")" == "scripts" ]; then
  path=".."
fi

PORT=4444 node "$path/node_modules/.bin/y-webrtc-signaling"
