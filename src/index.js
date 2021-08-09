import packer from './packer.js'
import { h } from 'vue'

export default {
    install: (app, options) =>
    {
        app.component('vueBinpacker', {
            render ()
            {
                return h(
                    'div',
                    {},
                    this.$slots.default()
                )
            },
            emits: ['layout-done'],
            props: {
                gap:
                {
                    type: Object,
                    default: () =>
                    {
                        return {
                            x: 0,
                            y: 0
                        }
                    }
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
            beforeUnmount ()
            {
                window.removeEventListener('resize', this.setPacker)
            },
            mounted ()
            {
                window.addEventListener('resize', this.setPacker)

                this.$el.style.position = 'relative'
                this.setObserver()

                if (!this.initLayout)
                {
                    return
                }

                this.setPacker()
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
                    if (this.observerPause || !this.initLayout)
                    {
                        return
                    }

                    this.setPacker()
                },
                setPacker ()
                {
                    this.observerPause = true

                    const gapNode = this.$el.querySelectorAll('[data-packer-gap="true"]')
                    const width = this.$el.getBoundingClientRect().width
                    const nodes = this.$el.querySelectorAll('[data-packer-item="true"]')
                    const rects = []
                    const gap = {
                        x: 0 || gapNode[0]?.getBoundingClientRect().width || this.gap.x,
                        y: 0 || gapNode[0]?.getBoundingClientRect().height || this.gap.y
                    }

                    for (let i = 0; i < nodes.length; i++)
                    {
                        const rect = nodes[i].getBoundingClientRect()

                        rects.push({
                            width: rect.width,
                            height: rect.height
                        })
                    }

                    const container = { width: width, height: Infinity }
                    const result = packer(container, rects, { rtl: this.rtl, gap: gap })

                    let containerHeight = 0

                    for (let i = 0; i < nodes.length; i++)
                    {
                        nodes[i].style.position = 'absolute'
                        nodes[i].style.left = 0
                        nodes[i].style.top = 0
                        nodes[i].style.transform = 'translate(' + result[i].x + 'px, ' + result[i].y + 'px)'

                        const offsetHeight = result[i].y + result[i].height

                        containerHeight = (offsetHeight > containerHeight) ? offsetHeight : containerHeight
                    }

                    this.$el.style.height = containerHeight + 'px'

                    window.requestAnimationFrame(() =>
                    {
                        window.requestAnimationFrame(() =>
                        {
                            this.observerPause = false
                            this.$emit('layout-done', result)
                        })
                    })
                }
            },
            watch:
            {
                toggleLayout ()
                {
                    this.setPacker()
                }
            }
        })
    }
}