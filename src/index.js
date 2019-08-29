import Vue from 'vue'
import packer from '../lib/packer.js'

export default {

    install (Vue, options)
    {
        Vue.component('vueBinpacker', {
            render: function (createElement)
            {
                return createElement(
                    'div',
                    this.$slots.default
                )
            },
            props: {
                gap:
                {
                    type: Number,
                    required: false,
                    default: 0
                },
                rtl:
                {
                    type: Boolean,
                    required: false,
                    default: false
                },
                initLayout:
                {
                    type: Boolean,
                    required: false,
                    default: true
                },
                toggleLayout:
                {
                    type: Boolean,
                    required: false,
                    default: false
                }
            },
            data ()
            {
                return {
                    observer: null,
                    observerPause: false
                }
            },
            created ()
            {
                window.addEventListener('resize', this.setPacker)
            },
            beforeDestroy ()
            {
                window.removeEventListener('resize', this.setPacker)
            },
            mounted ()
            {
                this.setObserver()
                this.setPacker()
                this.$el.style.position = 'relative'
            },
            methods:
            {
                setObserver ()
                {
                    this.observer = new MutationObserver(this.setObserverMutations)
                    this.observer.observe(this.$el, { childList: true, attributes: true, subtree: true })
                },
                setObserverMutations (mutations)
                {
                    if (this.observerPause)
                    {
                        return
                    }

                    this.setPacker()
                },
                setPacker ()
                {
                    this.observerPause = true

                    const gap  = this.$el.querySelectorAll('[data-packer-gap="true"]')
                    const width = this.$el.getBoundingClientRect().width
                    const nodes = this.$el.querySelectorAll('[data-packer-item="true"]')
                    const rects = []

                    var gapSize = 0

                    if (gap.length)
                    {
                        gapSize = gap[0].getBoundingClientRect().width
                    }

                    else if (this.gap)
                    {
                        gapSize = this.gap
                    }

                    for (let i = 0; i < nodes.length; i++)
                    {
                        let rect = nodes[i].getBoundingClientRect()

                        rects.push({
                            width: Math.floor(rect.width),
                            height: Math.floor(rect.height)
                        })
                    }

                    const container = { width: width, height: Infinity }
                    const result = packer(container, rects, {rtl: this.rtl, gap: gapSize})

                    var containerHeight = 0

                    for (let i = 0; i < nodes.length; i++)
                    {
                        nodes[i].style.position = 'absolute'
                        nodes[i].style.left = 0
                        nodes[i].style.top = 0
                        nodes[i].style.transform = 'translate(' + result[i].x + 'px, ' + result[i].y + 'px)'

                        var offsetHeight = result[i].y + result[i].height

                        containerHeight = (offsetHeight > containerHeight) ? offsetHeight : containerHeight
                    }

                    this.$el.style.height = containerHeight + 'px'

                    window.requestAnimationFrame(() =>
                    {
                        window.requestAnimationFrame(() =>
                        {
                            this.observerPause = false
                        })
                    })
                }
            }
        })
    }
}
