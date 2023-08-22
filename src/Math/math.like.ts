/**
 * @internal
 */
export interface IColor4Like {
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * @internal
 */
export interface IColor3Like {
  r: number;
  g: number;
  b: number;
}

export interface IQuaternionLike {
  x: number;
  y: number;
  z: number;
  w: number;
}

/**
 * @internal
 */
export interface IVector4Like {
  x: number;
  y: number;
  z: number;
  w: number;
}

/**
 * @internal
 */
export interface IVector3Like {
  x: number;
  y: number;
  z: number;
}

/**
 * @internal
 */
export interface IVector2Like {
  x: number;
  y: number;
}

/**
 * @internal
 */
export interface IMatrixLike {
  toArray(): number[];
  updateFlag: number;
}

/**
 * @internal
 */
export interface IViewportLike {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * @internal
 */
export interface IPlaneLike {
  normal: IVector3Like;
  d: number;
  normalize(): void;
}
