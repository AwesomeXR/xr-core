import { IFlowNodeMeta, IFlowNodeTypeRegisterData } from 'ah-flow-node';
import { BaseInput, BaseOutput } from '../base';
import { Quaternion, Vector3 } from '../../Math';

declare module 'ah-flow-node' {
  interface IFlowNodeMetaMap {
    IntersectionNode: IFlowNodeMeta<
      'IntersectionNode',
      {
        targetCenter: 'Vector3';
        position: 'Vector3';
        rotation: 'Vector3';
        boundType: 'String';
        size: 'Vector3';
        active: 'Boolean';
      } & BaseInput,
      {
        intersected: 'Boolean';
      } & BaseOutput
    >;
  }
}

export const IntersectionNodeRegisterData: IFlowNodeTypeRegisterData<'IntersectionNode'> = {
  define: {
    className: 'IntersectionNode',
    cnName: '碰撞体',
    input: {
      active: { title: '启用', dataType: 'Boolean', defaultValue: true },
      targetCenter: { title: '目标中心', dataType: 'Vector3' },
      position: { title: '位置', dataType: 'Vector3', defaultValue: new Vector3(0, 0, 0) },
      rotation: { title: '旋转', dataType: 'Vector3', defaultValue: new Vector3(0, 0, 0) },
      boundType: {
        title: '形状',
        dataType: 'String',
        defaultValue: 'Cube',
        options: [
          { label: '立方体', value: 'Cube' },
          { label: '球体', value: 'Sphere' },
          { label: '柱体', value: 'Cylinder' },
        ],
      },
      size: { title: '尺寸', dataType: 'Vector3', defaultValue: new Vector3(1, 1, 1) },
      ...BaseInput,
    },
    output: {
      intersected: { title: '相交', dataType: 'Boolean' },
      ...BaseOutput,
    },
  },
  setup(ctx) {
    let boundSpRadius = 0;

    function reloadCalcInfo() {
      if (ctx.input.size) {
        const { x, y, z } = ctx.input.size;
        const hx = x / 2;
        const hy = y / 2;
        const hz = z / 2;

        boundSpRadius = Math.sqrt(hx * hx + hy * hy + hz * hz);
      } else {
        boundSpRadius = 0;
      }
    }

    function flush() {
      if (!ctx.input.targetCenter || !ctx.input.position || !ctx.input.size || !ctx.input.active || !boundSpRadius) {
        ctx.output.intersected = false;
        return;
      }

      // 快速测试
      const objRadius = ctx.input.targetCenter.subtract(ctx.input.position).length();
      if (boundSpRadius < objRadius) {
        ctx.output.intersected = false;
        return;
      }

      const { revTranslation, revRotation } = calcRevTransform(
        ctx.input.position,
        ctx.input.rotation ? ctx.input.rotation.scale(Math.PI / 180) : Vector3.Zero()
      );

      // 逆变换
      const targetRevCenter = ctx.input.targetCenter.add(revTranslation).applyRotationQuaternion(revRotation);
      const { x, y, z } = targetRevCenter;

      const { size, boundType } = ctx.input;

      let isInSide: boolean;

      // 立方
      if (boundType === 'Cube') {
        const xr = [-size.x / 2, +size.x / 2];
        const yr = [-size.y / 2, +size.y / 2];
        const zr = [-size.z / 2, +size.z / 2];

        const xInRange = xr[0] <= x && x <= xr[1];
        const yInRange = yr[0] <= y && y <= yr[1];
        const zInRange = zr[0] <= z && z <= zr[1];

        isInSide = xInRange && yInRange && zInRange;
      }
      // 椭球
      else if (boundType === 'Sphere') {
        isInSide = isInsideEllipsoid(x, y, z, size.x / 2, size.y / 2, size.z / 2);
      }
      // 柱体
      else if (boundType === 'Cylinder') {
        const yr = [-size.y / 2, +size.y / 2];
        const yInRange = yr[0] <= y && y <= yr[1];

        if (yInRange) {
          isInSide = isInsideEllipse(x, z, size.x / 2, size.z / 2);
        } else {
          isInSide = false;
        }
      }
      //
      else isInSide = false;

      ctx.output.intersected = isInSide;
    }

    ctx.event.listen('input:change:targetCenter', flush);
    ctx.event.listen('input:change:position', flush);
    ctx.event.listen('input:change:rotation', flush);
    ctx.event.listen('input:change:boundType', flush);
    ctx.event.listen('input:change:active', flush);
    ctx.event.listen('input:change:size', () => {
      reloadCalcInfo();
      flush();
    });

    reloadCalcInfo();
    flush();

    return () => {};
  },
};

function calcRevTransform(translation: Vector3, rotation: Vector3) {
  const revTranslation = translation.scale(-1);
  const revRotation = Quaternion.FromEulerAngles(-rotation.x, -rotation.y, -rotation.z);

  return { revTranslation, revRotation };
}

function isInsideEllipse(x: number, y: number, a: number, b: number) {
  // 先判断点是否在外接矩形内
  let xMin = -a;
  let xMax = a;
  let yMin = -b;
  let yMax = b;

  if (x < xMin || x > xMax || y < yMin || y > yMax) {
    return false;
  }

  // 再判断点是否在椭圆内
  let x2 = x * x;
  let y2 = y * y;

  return x2 / (a * a) + y2 / (b * b) <= 1;
}

function isInsideEllipsoid(x: number, y: number, z: number, a: number, b: number, c: number) {
  // 先判断点是否在外接矩形内
  const xMin = -a;
  const xMax = a;
  const yMin = -b;
  const yMax = b;
  const zMin = -c;
  const zMax = c;

  if (x < xMin || x > xMax || y < yMin || y > yMax || z < zMin || z > zMax) {
    return false;
  }

  // 再计算椭球方程
  const x2 = x * x;
  const y2 = y * y;
  const z2 = z * z;

  return x2 / (a * a) + y2 / (b * b) + z2 / (c * c) <= 1;
}
