# Pizza Cam

Fun project created in few hours before pizza arrival at the office on Pizza Day.
Every user is given UUID and this way the avatar is unique for user, but do not trust this, do not trust anyone.

To make it work

1. Have some kind of camera
2. Buid front with `npm pack`
3. Start backend with `npm start`
4. Start stream to backend service from OBS with `rtmp://localhost:56665/live` in server field and `STREAM_KEY` in key field
5. Open website, watch and chat
6. Eat 🍕 a lot of 🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕

### Project configuration

`./frontend/.env`

```
CHAT_SERVER_ADDRESS= # BACKEND ADDRESS #
CHAT_SERVER_PORT=
MEDIA_STREAM_ADDRESS= # BACKEND ADDRESS #
MEDIA_STREAM_PORT= # EQUAL TO BACKEND MEDIA_HTTP_PORT #
STREAM_KEY=
```

`./backend/.env`

```
CHAT_PORT=
SERVER_PORT=
MEDIA_HTTP_PORT= # PORT TO GET VIDEO FROM #
MEDIA_RTMP_PORT= # PORT TO STREAM VIDEO TO #
```

### Disclaimers

Project created quickly in few hours while waiting for pizza so expect it to not work.

Have fun.
