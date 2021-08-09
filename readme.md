# Vue.js Packery Plugin

A Bin Packer Plugin for Vue.js 3.x. Similiar to the well known Packery based on [Nikolay Karev's work](https://github.com/karevn/binpack-2d).

### Installing

```
npm install --save vue-binpacker-plugin
```

then

```
import VueBinpackerPlugin from 'vue-binpacker-plugin'

createApp(App).use(VueBinpackerPlugin)
```

### Usage

```
<VueBinpacker>

    <div data-packer-item='true'></div>
    <div data-packer-item='true'></div>

</VueBinpacker>
```

### Layout Direction

It's possible to layout from rtl

```
<VueBinpacker :rtl='true'>
...
```

### Gap

There are two ways to set the gap between images. Setting an explicit width as prop.

```
<VueBinpacker :gap='{ x: 10 y: 20 }'>
...
```

Defining an Element as reference.

```
<VueBinpacker>

    <span data-packer-gap='true'>

    <div data-packer-item='true'></div>
    <div data-packer-item='true'></div>

</VueBinpacker>
```

### Manually init layout

If desired it's possible to trigger the layout at a specific moment. To do so set the initLayout prop to false and trigger the layout by switching the toggleLayout prop.

```
<VueBinpacker :initLayout='false' :toggleLayout='false'>
...
```

### Manual relayout

By switching the toggleLayout prop a manual relayout can achieved.

```
<VueBinpacker :initLayout='false' :toggleLayout='false'>
...
```

# Events

```
@layoutDone => triggered when layout done returns the result of the packing algorithm
```

### Roadmap

- ~~Testing for Browser Compatibility~~ (Working on all recents browsers, including IE11)
- ~~Extend documentation~~
- Support for horizontal layouts
- ~~Eventhandling for manually triggering layouts~~

### Vue.js 2.x

Please install the package version @1.1.0
