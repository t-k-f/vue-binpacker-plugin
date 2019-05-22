# Vue.js Packery Plugin

A Bin Packer Plugin. Similiar to the well known Packery based on [Nikolay Karev's work](https://github.com/karevn/binpack-2d).

### Installing

```
npm install --save vue-binpacker-plugin
```

then

```
import VueBinpackerPlugin from 'vue-binpacker'

Vue.use(VueBinpackerPlugin)
```

### Usage

```
<VueBinpacker>

    <div data-packer-item='true'></div>
    <div data-packer-item='true'></div>

<VueBinpacker>
```

### Roadmap

- ~~Testing for Browser Compatibility~~ (Working on all recents browsers, including IE11)
- Extend documentation
- Support for horizontal layouts
- Eventhandling for manually triggering layouts
