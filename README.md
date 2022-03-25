### Install

```shell
# npm
npm install zc-react-hook-tools
```

### How to use

```ts
import { useSetState } from 'zc-react-hook-tools'

// TODO use useSetState
```

### Docs

#### hook-tools

| Method                              | Description  |
| ----                                |  ----                |
| useSetState                         | Record类型的useState |
| useBooleanState                     | Boolean类型的useState |
| useNextEffect                       | 用于处理重复渲染的问题，这个会自动屏蔽第一次render |
| useLocalState                       | localStorage版本的useState |
| useLast                             | 获取最新的值使用，用于处理hook闭包问题 |
| useDeepEffect                       | 使用lodash/isEqual对比useEffect deps (深度对比) |
| useMount                            | 组件装在时 |
| useUnmount                          | 组件卸载时 |
| useRetry                            | 自动重试异步任务，一般用于http请求重试 |
| useRect                             | 获取dom尺寸信息 |
| useWindowResize                     | 监听window窗口变化(带去抖函数) |
| useTriggerWindow                    | 用于同域下多窗口通信(使用localStorage实现) |
| useWhoUpdated                       | 用于检测组件props或state变化 |
| useWindowVisibility                 | 用于监听浏览器tab切换 |
| useRafInterval                      | hook版本定时器，基于`RafTimer`实现性能优于`setInterval`,可暂停启动 |
| useList                             | hook版本TodoList |

#### js-tools
| Method                              | Description  |
| ----                                | ----         |
| RafTimer                            | 基于requestAnimationFrame实现setTimeout/setInterval(切换浏览器tab会自动暂停,性能优于setTimeout/setInterval) |
