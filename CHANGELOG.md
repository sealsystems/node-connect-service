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
