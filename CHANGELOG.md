## 3.0.7 (2021-01-16)

### Chores


Update build config ([ef8f7ff](https://github.com/sealsystems/node-connect-service/commit/ef8f7ff))

## 3.0.6 (2020-12-26)

### Chores


Update build configuration ([0d90109](https://github.com/sealsystems/node-connect-service/commit/0d90109))

Update build configuration ([8c898de](https://github.com/sealsystems/node-connect-service/commit/8c898de))

## 3.0.5 (2020-12-21)

### Chores


Trigger release ([a256090](https://github.com/sealsystems/node-connect-service/commit/a256090))

## 3.0.4 (2020-10-08)

### Bug Fixes


#### Check for localhost and 127.0.0.1 ([c73d631](https://github.com/sealsystems/node-connect-service/commit/c73d631))

Use the correct protocol if we set SERVICE_URL of a service to `localhost` or `127.0.0.1`.


---

## 3.0.3 (2020-09-02)

### Chores


bump [@sealsystems](https://github.com/sealsystems)/log from 2.2.0 to 2.2.1 ([#48](https://github.com/sealsystems/node-connect-service/issues/48)) ([2e330d0](https://github.com/sealsystems/node-connect-service/commit/2e330d0))

bump [@sealsystems](https://github.com/sealsystems)/log from 2.2.1 to 2.2.2 ([#66](https://github.com/sealsystems/node-connect-service/issues/66)) ([92d0e16](https://github.com/sealsystems/node-connect-service/commit/92d0e16))

bump [@sealsystems](https://github.com/sealsystems)/tlscert from 2.3.0 to 2.3.7 ([#49](https://github.com/sealsystems/node-connect-service/issues/49)) ([dbf3132](https://github.com/sealsystems/node-connect-service/commit/dbf3132))

bump [@sealsystems](https://github.com/sealsystems)/tlscert from 2.3.7 to 2.3.8 ([#67](https://github.com/sealsystems/node-connect-service/issues/67)) ([cb4487d](https://github.com/sealsystems/node-connect-service/commit/cb4487d))

removed unnecessary log message and updated deps ([c49b1d7](https://github.com/sealsystems/node-connect-service/commit/c49b1d7))

## 3.0.2 (2020-03-09)

### Chores


#### Switched to github actions. ([568883f](https://github.com/sealsystems/node-connect-service/commit/568883f))



---

## 3.0.1 (2019-11-14)

### Chores


#### updated deps ([139469b](https://github.com/sealsystems/node-connect-service/commit/139469b))



---

## 3.0.0 (2019-11-12)

### Features


#### Removed requires of consul, use options parameter ([8ec0224](https://github.com/sealsystems/node-connect-service/commit/8ec0224))



### BREAKING CHANGES

#### Interface changed: consul is now part of options parameter.

Examples for connectService call:

```javascript
const consul = require('@sealsystems/consul');

consul.connect(...);

connectService({
  consul,
  service: 'serviceName'
}, {
  host: '...',
  port: 123
});
```

---

## 2.3.0 (2019-10-18)

### Features


#### PLS-431, [PLS-431](https://jira.sealsystems.de/jira/browse/PLS-431) ([aa0f20c](https://github.com/sealsystems/node-connect-service/commit/aa0f20c))

- Removed roboter
 - Updated GitHub Pull Request template
 - Updated dependencies
 - Updated CircleCI config
 - Updated AppVeyor config
 - Added `package-lock.json` to git
 - Added dependabot config
 - Fixed linting
 - Fixed unit-tests
 - Used `seal-node:oss-module-update`


---

## 2.2.3 (2019-10-15)

### Chores


#### bump [@sealsystems](https://github.com/sealsystems)/tlscert from 2.2.1 to 2.3.0 ([dec4085](https://github.com/sealsystems/node-connect-service/commit/dec4085))

Bumps @sealsystems/tlscert from 2.2.1 to 2.3.0.

Signed-off-by: dependabot-preview[bot] <support@dependabot.com>


---

## 2.2.2 (2019-10-08)

### Chores


#### bump [@sealsystems](https://github.com/sealsystems)/tlscert from 2.2.0 to 2.2.1 ([b95caa7](https://github.com/sealsystems/node-connect-service/commit/b95caa7))

Bumps @sealsystems/tlscert from 2.2.0 to 2.2.1.

Signed-off-by: dependabot-preview[bot] <support@dependabot.com>


---

## 2.2.1 (2019-10-08)

### Chores


#### bump [@sealsystems](https://github.com/sealsystems)/log from 2.1.0 to 2.2.0 ([1f7eb86](https://github.com/sealsystems/node-connect-service/commit/1f7eb86))

Bumps @sealsystems/log from 2.1.0 to 2.2.0.

Signed-off-by: dependabot-preview[bot] <support@dependabot.com>


---

## 2.2.0 (2019-09-27)

### Features


#### PLS-431 ([6fd27e8](https://github.com/sealsystems/node-connect-service/commit/6fd27e8))

- Removed roboter
 - Added dependabot
 - Updated GitHub Pull Request template
 - Updated CircleCI config
 - Updated appveyor config
 - Updated dependencies
 - Fixed linting


---

## 2.1.3 (2018-11-20)



---

## 2.1.2 (2018-11-15)



---

## 2.1.1 (2018-09-09)

### Bug Fixes


#### Include all needed files in Node.js module ([b33fe64](https://github.com/sealsystems/node-connect-service/commit/b33fe64))



---

## 2.1.0 (2018-09-08)

### Features


#### Use semantic-release ([54fedcc](https://github.com/sealsystems/node-connect-service/commit/54fedcc))



---
