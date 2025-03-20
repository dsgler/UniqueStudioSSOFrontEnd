export type timeRangesType = [Date, Date];

// 合并重叠的时间段
export function sortAndMergeTimeRanges(timeRanges: timeRangesType[]) {
  if (timeRanges.length === 0) return [];

  // 按照开始时间排序，如果开始时间相同，则按照结束时间排序
  timeRanges.sort(
    (a, b) =>
      a[0].getTime() - b[0].getTime() || a[1].getTime() - b[1].getTime(),
  );
  if (timeRanges.length < 2) return timeRanges;

  const merged = [timeRanges[0]];
  for (let i = 1; i < timeRanges.length; i += 1) {
    const current = timeRanges[i];
    const lastMerged = merged[merged.length - 1];

    // 如果当前时间段与最后一个合并的时间段重叠，则合并它们
    if (current[0] <= lastMerged[1]) {
      lastMerged[1] = new Date(
        Math.max(lastMerged[1].getTime(), current[1].getTime()),
      );
    } else {
      // 否则，将当前时间段加入合并后的数组
      merged.push(current);
    }
  }

  return merged;
}

// 判断两个时间段是否重合
function isOverlapping(startA: Date, endA: Date, startB: Date, endB: Date) {
  return !(endA <= startB || startA >= endB);
}

// 判断一个时间段是否与多个时间段重合
export function isOverlappingWithAny(
  newStart: Date,
  newEnd: Date,
  mergedTimeRanges: timeRangesType[],
) {
  // 合并重叠的时间段
  // const mergedIntervals = mergeIntervals(timeRanges);

  // 使用二分查找找到可能重合的时间段
  let left = 0;
  let right = mergedTimeRanges.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const [start, end] = mergedTimeRanges[mid];

    if (isOverlapping(newStart, newEnd, start, end)) {
      return true; // 与某个时间段重合
    }

    if (newEnd <= start) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return false; // 与所有时间段都不重合
}

// 示例使用
// const timeRanges: timeRangesType[] = [
//   [new Date('2025-03-20T14:00:00'), new Date('2025-03-20T16:00:00')],
//   [new Date('2025-03-20T10:00:00'), new Date('2025-03-20T12:00:00')],
//   [new Date('2025-03-20T09:00:00'), new Date('2025-03-20T11:00:00')],
//   [new Date('2025-03-20T13:00:00'), new Date('2025-03-20T15:00:00')],
// ];

// const newStart = new Date('2025-03-20T12:30:00');
// const newEnd = new Date('2025-03-20T13:31:00');

// console.log(isOverlappingWithAny(newStart, newEnd, timeRanges));
