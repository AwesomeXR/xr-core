![workflow](https://github.com/ch-real3d/xr-core/actions/workflows/ci.yml/badge.svg)

xr-core 是 xr 套件的底层库:

1. 定义了所有 XRFlowNode 的类型
1. 依赖倒置，由外部注入 XRFlowNode 的实现: `FlowNodeTypeRegistry.Default.register()`
