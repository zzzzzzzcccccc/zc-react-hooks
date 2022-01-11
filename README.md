### 说明 (instruction)

| 方法 (Method)                       |   描述 (Description)  |
| ----                                |  ----                |
| useSetState                         | Record类型的useState |
| useBooleanState                     | Boolean类型的useState |
| useNextEffect                       | 用于处理重复渲染的问题，这个会自动屏蔽第一次render |
| useLocalState                       | localStorage版本的useState |
| useLast                             | 获取最新的值使用，用于处理hook闭包问题 |
| useDeepEffect                       | 使用lodash/isEqual对比useEffect deps (深度对比) |
