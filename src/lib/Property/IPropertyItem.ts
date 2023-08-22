import { IFlowDTKey, IFlowNodeInput } from 'ah-flow-node';

export type IPropertyItem =
  | {
      type: 'value';
      dataType: IFlowDTKey;
      value: string | number | boolean;
    }
  | {
      type: 'binding';
      ioType: 'input' | 'output';
      ioKey: string;
      ioDef: IFlowNodeInput<IFlowDTKey>;
    };
