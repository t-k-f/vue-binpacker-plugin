import packer from './lib/packer.js'
import { h, onBeforeUnmount, onMounted, ref } from 'vue'

export default {
    install: (app, options) =>
    {
        app.component('VueBinpacker', {
            props:
            {
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
            setup (props, { slots })
            {
                const element = ref(null)
                const observerPause = ref(false)

                let observerResize = null
                let observerMutation = null

                const setPacker = async () =>
                {
                    if (observerPause.value || !props.initLayout) return

                    observerPause.value = true

                    console.log('runs')

                    const gap = {}
                    const gapNode = element.value.querySelectorAll('[data-packer-gap="true"]')
                    const width = element.value.getBoundingClientRect().width
                    const nodes = element.value.querySelectorAll('[data-packer-item="true"]')
                    const rects = []

                    if (gapNode.length)
                    {
                        gap.x = gapNode[0].getBoundingClientRect().width
                        gap.y = gapNode[0].getBoundingClientRect().height
                    }

                    else
                    {
                        gap.x = props.gap.x
                        gap.y = props.gap.y
                    }

                    for (let i = 0; i < nodes.length; i++)
                    {
                        const rect = nodes[i].getBoundingClientRect()

                        rects.push({
                            width: rect.width,
                            height: rect.height
                        })
                    }

                    const container = { width, height: Infinity }
                    const result = packer(container, rects, { rtl: props.rtl, gap })

                    let containerHeight = 0

                    for (let i = 0; i < nodes.length; i++)
                    {
                        nodes[i].style.position = 'absolute'
                        nodes[i].style.left = 0
                        nodes[i].style.top = 0
                        nodes[i].style.transform = `translate(${result[i].x}px, ${result[i].y}px)`

                        const offsetHeight = result[i].y + result[i].height

                        containerHeight = (offsetHeight > containerHeight) ? offsetHeight : containerHeight
                    }

                    element.value.style.height = `${containerHeight}px`

                    await new Promise(requestAnimationFrame)
                    await new Promise(requestAnimationFrame)

                    observerPause.value = false
                }

                const setObservers = () =>
                {
                    observerResize = new ResizeObserver(setPacker)
                    observerMutation = new MutationObserver(setPacker)

                    observerResize.observe(element.value)
                    observerMutation.observe(element.value, { childList: true, attributes: true, subtree: true })
                }

                onMounted(() =>
                {
                    element.value.style.position = 'relative'

                    setObservers()
                    setPacker()
                })

                onBeforeUnmount(() =>
                {
                    observerResize.disconnect()
                    observerMutation.disconnect()
                })

                return () => h('div', { ref: element }, slots.default())
            }
        })
    }
}