### Install

```shell
npm install zc-react-hook-tools
```

### How to use

```ts
import { useSetState } from 'zc-react-hook-tools'
```

### Docs

#### [Sandbox](https://codesandbox.io/dashboard/all/zc-react-hook-tools?workspace=aef8c8df-20db-4fec-a47a-cd290d986617)

#### hook-tools

| Method                              | Description  |                                          demo                 |
| ----                                |  ----                | --- |
| useSetState                         | Record类型的useState | https://codesandbox.io/s/usesetstate-54yskd |
| useBooleanState                     | Boolean类型的useState | https://codesandbox.io/s/usebooleanstate-zi75rv |
| useNextEffect                       | 用于处理重复渲染的问题，这个会自动屏蔽第一次render |
| useLocalState                       | localStorage版本的useState | https://codesandbox.io/s/uselocalstate-55jgnc |
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
| useList                             | hook版本TodoList |  |
| useClipboard                        | hook版本clipboard | https://codesandbox.io/s/useclipboard-hy704o |
| useCounter                          | 计数器可设置最大值最小值 | |
| useActiveSelection                  | 获取鼠标光标选中文案 | https://codesandbox.io/s/useactiveselection-8scvjs |
| useRafTimeout                       | 基于`RafTimer`实现setTimeout | |
| useNetwork                          | 获取当前设备网络状况 | https://codesandbox.io/s/usenetwork-4n2hkv |
| useKeyboard                         | 监听键盘事件 | |
| useEventOutside                     | 监听触发events不包含某一些dom | https://codesandbox.io/s/useeventoutside-usy6mt |
| useObservable                       | hook结合rxjs`BehaviorSubject` | |
| useAsyncCallback                    | async版本useCallback增加了执行锁 | |

#### js-tools
| Method                              | Description  |  demo |
| ----                                | ----         | --- |
| RafTimer                            | 基于requestAnimationFrame实现setTimeout/setInterval(切换浏览器tab会自动暂停,性能优于setTimeout/setInterval) | https://codesandbox.io/s/raftimer-forked-oj82jo |
