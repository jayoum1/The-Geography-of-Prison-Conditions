import { CATEGORY_MEDIA } from "../data/categoryMedia.js";

/** Inclusive [startPara, endPara] per media item — where to place each image in the article. */
const PARAGRAPH_RANGES = {
  severe: [[0, 0], [1, 2], [3, 3], [4, 4], [5, 6]],
  high: [[0, 2], [3, 4], [5, 6]],
  moderate: [[0, 4], [5, 7]],
  lower: [[0, 0], [1, 2], [3, 3], [4, 5]],
};

function autoRanges(paragraphCount, mediaCount) {
  const ranges = [];
  for (let i = 0; i < mediaCount; i++) {
    const start = Math.floor((i * paragraphCount) / mediaCount);
    const end = Math.floor(((i + 1) * paragraphCount) / mediaCount) - 1;
    ranges.push([start, Math.max(start, end)]);
  }
  const last = ranges[ranges.length - 1];
  if (last) last[1] = paragraphCount - 1;
  return ranges;
}

/** @returns {{ mediaIndex: number, startPara: number, endPara: number }[]} */
export function getStorySteps(slug, paragraphCount) {
  const items = CATEGORY_MEDIA[slug]?.items ?? [];
  if (!items.length || !paragraphCount) return [];

  const custom = PARAGRAPH_RANGES[slug];
  const ranges =
    custom?.length === items.length
      ? custom
      : autoRanges(paragraphCount, items.length);

  return ranges.map(([startPara, endPara], mediaIndex) => ({
    mediaIndex,
    startPara,
    endPara: Math.min(endPara, paragraphCount - 1),
  }));
}
