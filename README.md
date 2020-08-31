# 🚀 axios-cache-adapter-fs

Use the local File System as a `Store` for [axios-cache-adapter](https://www.npmjs.com/package/axios-cache-adapter).

This is built to enable easy caching on disk when building scripts that you intend to run in your local system only. 

## Install
### Using npm
```sh
npm install --save axios-cache-adapter-fs
```

## Usage
You can give a FileStore instance to axios-cache-adapter which will be used to store cache data instead of the default in-memory store.

```ts
import axios, { AxiosRequestConfig } from "axios"
import { setupCache } from "axios-cache-adapter"
import FileStore from "axios-cache-adapter-fs"

// `axios-cache-adapter` options
const instanceCache = setupCache({
    store: new FileStore(),
})

// `axios` options
const config: AxiosRequestConfig = {
    baseURL: "https://example.com",
    adapter: instanceCache.adapter,
}

const httpClient = axios.create(config)

const response = await httpClient.get("/url")
```

**Important note:** Only `GET` request results are cached by default. Executing a request using any method listed in `exclude.methods` will invalidate the cache for the given URL.

Refer [axios-cache-adapter](https://www.npmjs.com/package/axios-cache-adapter)'s docs for further details.