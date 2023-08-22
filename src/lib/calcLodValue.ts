import { IVector3Like, Vector3 } from '../Math';
import { getBoundBoxPoints } from './getBoundBoxPoints';

export function calcLodValue<T>(
  position: Vector3,
  targetCenter: IVector3Like,
  targetSize: IVector3Like,
  lodList: { value?: T; distance: number }[]
) {
  const targetCenterVec = new Vector3(targetCenter.x, targetCenter.y, targetCenter.z);

  const points = [...getBoundBoxPoints(targetCenter, targetSize), targetCenterVec];
  const distances = points.map(p => p.subtract(position).length());
  const minDistance = Math.min(...distances);

  const sortedLodList = [...lodList].sort((a, b) => a.distance - b.distance);

  let pickedItem: { value: T; index: number; distance: number } | undefined;

  // pick 一个 lod 值
  for (let i = 0; i < sortedLodList.length; i++) {
    const lod = sortedLodList[i];

    let distanceX = lod.distance;

    if (minDistance <= distanceX && typeof lod.value !== 'undefined') {
      pickedItem = { value: lod.value, index: i, distance: minDistance };
      break;
    }
  }

  return pickedItem;
}
