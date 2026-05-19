const BASE = import.meta.env.BASE_URL || "/";
const media = (path) => `${BASE}media/${path}`;

const AMENDMENT_8 =
  "Excessive bail shall not be required, nor excessive fines imposed, nor cruel and unusual punishments inflicted.";

const AMENDMENT_14 =
  "All persons born or naturalized in the United States, and subject to the jurisdiction thereof, are citizens of the United States and of the State wherein they reside. No State shall make or enforce any law which shall abridge the privileges or immunities of citizens of the United States; nor shall any State deprive any person of life, liberty, or property, without due process of law; nor deny to any person within its jurisdiction the equal protection of the laws.";

export const CATEGORY_MEDIA = {
  severe: {
    items: [
      {
        type: "image",
        src: media("category-severe/merlin-prison.webp"),
        alt: "Mississippi State Penitentiary at Parchman",
      },
      {
        type: "image",
        src: media("category-severe/private-prisons-map.webp"),
        alt: "Map of private prisons in the United States",
      },
      {
        type: "amendment",
        title: "Eighth Amendment",
        text: AMENDMENT_8,
      },
      {
        type: "amendment",
        title: "Fourteenth Amendment",
        text: AMENDMENT_14,
      },
      {
        type: "video",
        src: media("category-severe/conditions-recording.mp4"),
        alt: "Video on Mississippi prison conditions",
      },
    ],
  },

  high: {
    items: [
      {
        type: "image",
        src: media("category-high/kevin-carter.webp"),
        alt: "Kevin Carter",
      },
      {
        type: "image",
        src: media("category-high/kevin-grave.webp"),
        alt: "Memorial at Kevin Carter's grave",
      },
      {
        type: "image",
        src: media("category-high/prison-overcrowding.jpeg"),
        alt: "Overcrowded prison housing",
      },
    ],
  },

  moderate: {
    items: [
      {
        type: "image",
        src: media("category-moderate/nevada-prison-tour.jpg"),
        alt: "Nevada correctional facility",
      },
      {
        type: "image",
        src: media("category-moderate/staffing-screenshot.png"),
        alt: "Nevada corrections staffing data",
      },
    ],
  },

  lower: {
    items: [
      {
        type: "image",
        src: media("category-lower/chowchilla-prison.webp"),
        alt: "Chowchilla women's prison, California",
      },
      {
        type: "image",
        src: media("category-lower/kern-valley-prison.webp"),
        alt: "Kern Valley State Prison, California",
      },
      {
        type: "image",
        src: media("category-lower/ct-oversight-screenshot.png"),
        alt: "Connecticut prison oversight reporting",
      },
      {
        type: "image",
        src: media("category-lower/ca-infrastructure-screenshot.png"),
        alt: "California prison infrastructure costs",
      },
    ],
  },
};
