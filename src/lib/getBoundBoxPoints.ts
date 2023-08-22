import { IVector3Like, Vector3 } from '../Math';

export function getBoundBoxPoints(center: IVector3Like, size: IVector3Like) {
  const points = [
    new Vector3(center.x + size.x / 2, center.y + size.y / 2, center.z + size.z / 2),
    new Vector3(center.x + size.x / 2, center.y + size.y / 2, center.z - size.z / 2),
    new Vector3(center.x + size.x / 2, center.y - size.y / 2, center.z + size.z / 2),
    new Vector3(center.x + size.x / 2, center.y - size.y / 2, center.z - size.z / 2),
    new Vector3(center.x - size.x / 2, center.y + size.y / 2, center.z + size.z / 2),
    new Vector3(center.x - size.x / 2, center.y + size.y / 2, center.z - size.z / 2),
    new Vector3(center.x - size.x / 2, center.y - size.y / 2, center.z + size.z / 2),
    new Vector3(center.x - size.x / 2, center.y - size.y / 2, center.z - size.z / 2),
  ];
  return points;
}
