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

                    const width = this.$el.getBoundingClientRect().width
                    const nodes = this.$el.querySelectorAll('[data-packer-item="true"]')
                    const rects = []

                    for (let i = 0; i < nodes.length; i++)
                    {
                        let rect = nodes[i].getBoundingClientRect()

                        rects.push({
                            width: Math.floor(rect.width),
                            height: Math.floor(rect.height)
                        })
                    }

                    const container = { width: width, height: Infinity }
                    const result = packer(container, rects)

                    console.log(result)

                    for (let i = 0; i < nodes.length; i++)
                    {
                        nodes[i].style.position = 'absolute'
                        nodes[i].style.left = 0
                        nodes[i].style.top = 0
                        nodes[i].style.transform = 'translate(' + result[i].x + 'px, ' + result[i].y + 'px)'
                    }

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
