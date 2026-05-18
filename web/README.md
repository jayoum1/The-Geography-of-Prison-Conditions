# The Geography of Prison Conditions — demo

Interactive U.S. prison-conditions dashboard for a history final project.

> Thesis: the federal government should allocate funding to states for general
> prison operation costs — conditional on minimum living standards, staffing,
> medical care, infrastructure, transparency, and overcrowding reduction, not
> prison expansion.

## Run locally

```bash
npm install --legacy-peer-deps
npm run dev
```

Open <http://localhost:5173/>.

`--legacy-peer-deps` is needed because `react-simple-maps@3` declares peer
React 16/17/18 but works fine on React 19.

## Project layout

```
src/
  App.jsx                  # composes the page
  components/
    Hero.jsx               # title, thesis, directional disclaimer
    MapSection.jsx         # filters, U.S. map, tooltip, legend
    StatePanel.jsx         # right-hand state detail + story card
    RankingChart.jsx       # top-10 bar chart with highest/lowest toggle
    ScatterSection.jsx     # two state-level scatterplots
    StoriesSection.jsx     # representative state story cards
    Methodology.jsx        # methodology note
  data/
    categories.js          # pressure categories + state-name maps
    loadData.js            # CSV fetch + normalize + merge + pressure score
    metrics.js             # metric metadata + interpretation strings
    colorScale.js          # categorical + continuous color scales
    stories.js             # representative state stories
public/data/
  *.csv                    # the four source CSVs
  states-10m.json          # us-atlas state topology
```

## Data inputs

The four CSVs in `public/data/` are loaded at runtime, normalized (commas,
dollar signs, percent signs, "No data") and merged by canonical state name.
Per-prisoner spending uses the inflation-adjusted (FY 2024) column.

## Experimental pressure score

For each state we min-max normalize each available indicator to `[0, 1]`,
inverting officer salary and per-prisoner spending so that *lower* values raise
pressure. The score is the mean of the available components — missing values
are skipped, not zeroed. This is presented in the UI as an *experimental*
score, not a definitive ranking.
