# Scratch Clone

A Scratch-like visual coding environment built with React and TailwindCSS, on top of the Juspay starter project.

## Run it

```
npm i
npm start     # http://localhost:3000
npm test      # checks for the script editing and the animation engine
```

## Features

**Motion blocks:** move _ steps, turn left/right _ degrees, go to x: _ y: _

**Looks blocks:** say _ for _ seconds, think _ for _ seconds. A speech or thought bubble shows above the sprite, and the script waits until the time is up.

**Control:** repeat _. Other blocks drop inside it, and repeats can go inside repeats.

**Drag and drop:**
- Drag blocks from the sidebar into the script area: drop them on empty space, below a block, or inside a repeat.
- Drag script blocks to reorder them, or drop them back on the sidebar to delete them.
- Clicking a block in the sidebar runs it straight away on the selected sprite.

**Multiple sprites:** add, select and delete sprites under the stage, or click a sprite on the stage to select it. Each sprite has its own colour and its own script. **Play** runs every sprite's script at the same time, and **Stop** halts them.

## Hero feature: collision swap

When two sprites start touching, they swap their scripts and their place in them, so each one carries on with the other's animation.

The app opens with this demo ready: Cat 1 repeats "move 10" and Cat 2 repeats "move -10". Press **Play**: they walk toward each other, swap on contact, and walk apart.

The swap happens only when the touch *begins*, so sprites that keep overlapping don't swap back and forth.

## Code layout

| File | What it does |
|---|---|
| `src/App.js` | State (the sprites and the selected sprite) and the Play loop |
| `src/runner.js` | Pure animation engine: motion, say/think waits, collision swap (`tick`) |
| `src/scriptUtils.js` | Immutable edits to the block tree: insert, remove, update |
| `src/components/Sidebar.js` | Block palette |
| `src/components/MidArea.js` | Script editor with drag and drop |
| `src/components/PreviewArea.js` | Stage, bubbles and sprite list |
