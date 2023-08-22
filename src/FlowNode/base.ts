export type BaseInput = {
  _meta: 'JSON';
};

export const BaseInput = {
  _meta: { dataType: 'JSON' },
} as const;

export type BaseOutput = {
  loaded: 'Boolean';
};

export const BaseOutput = {
  loaded: { title: '已加载', dataType: 'Boolean' },
} as const;
