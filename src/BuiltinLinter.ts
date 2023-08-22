import { FlowNodeTypeRegistry, Util } from 'ah-flow-node';
import { IXRLintMsgItem, IXRLinterCB, XRLinterRegistry } from './XRLinterRegistry';
import { Deferred, getInternalRandomString } from './lib';

export const CommonLinter: IXRLinterCB = Deferred.wrapAsyncFn<Parameters<IXRLinterCB>, IXRLintMsgItem[]>(
  async (_defer, host, opt = {}) => {
    const msgs: IXRLintMsgItem[] = [];

    const allNodes = host.flowNodeManager.all;

    //#region 检查相机
    const hasCameraNode = allNodes.some(
      n =>
        (Util.isFlowNode('ArcRotateCameraNode', n) ||
          Util.isFlowNode('FreeCameraNode', n) ||
          Util.isFlowNode('ThirdPersonCameraNode', n)) &&
        n.enabled
    );
    if (!hasCameraNode) {
      if (opt.fix) {
        FlowNodeTypeRegistry.Default.factory('ArcRotateCameraNode')(host, getInternalRandomString());
      } else {
        msgs.push({ level: 'error', comment: '缺少相机节点', hostID: host.ID });
      }
    }
    //#endregion

    return msgs;
  }
);

XRLinterRegistry.Default.register('common', CommonLinter);
