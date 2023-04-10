# axios-api-gen

English｜[繁體中文](https://github.com/LaiJunBin/axios-api-gen/blob/main/README.zh-tw.md#axios-api-gen)

> This package is generate API from path definition, it is based on axios and it can integrate perfectly with mswx(mock service worker extension).

## Install
```
$ npm i axios-api-gen
```

## Basic usage

define endpoints. (api.ts)
```ts
import { METHOD, generateApi, type Endpoints } from 'axios-api-gen';

const endpoints = {
	getUsers: '/users',
	createUser: {
		method: METHOD.POST,
		path: '/users'
	},
	updateUser: {
		method: METHOD.PATCH,
		path: '/users/:id'
	},
	deleteUser: '/users/:id'
};

// type checking is optional.
const checkEndpoints: Endpoints = endpoints;

export default generateApi(endpoints);
```

Basic usage:
```ts
import api from './api'
api.getUsers().then((res) => {
    console.log(res)
})
```

---

## Auto-complete

![auto-complete](./docs/images/auto-complete.gif)

Do not directly assign the type when defining endpoints, as this may cause your IDE unavailable to auto-complete. If you want type-checking, please refer to the above example.

---

## generateApi options

The interface is defined as follows.
```ts
interface generateApiOptions {
  axiosInstance?: AxiosInstance
  beforeHandler?: () => void
  afterHandler?: () => void
}
```

### axiosInstance

You can customize axios instance, e.g.
```ts
import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_PREFIX,
	headers: {
		'Content-Type': 'application/json'
	}
});

// skip endpoint definition

export default generateApi(endpoints, {
	axiosInstance
});
```

### beforeHandler

A hook for before request.
```ts
export default generateApi(endpoints, {
	beforeHandler() {
		console.log('before');
	}
});
```

### afterHandler

A hook for request finished.
```ts
export default generateApi(endpoints, {
	afterHandler() {
		console.log('after');
	}
});
```

---

## Integrate mswx

[mswx](https://www.npmjs.com/package/mswx) is an extension of mock service worker, which is more convenient to use and has middleware features.

example:

```ts
import api from '@/api';
import { rest } from 'mswx';

export const handlers = [
	rest.define(api.getUsers, async (req, res, ctx) => {
		return res(ctx.status(200));
	})
];
```

Why does this work?

Because each API not only can call but also has two properties (method, path), for example:

```ts
console.log(api.getUsers.method); // output: GET
console.log(api.getUsers.path);   // output: /users
```
