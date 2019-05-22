function contains (container, rect)
{
    var otherWidth = rect.width || 0
    var otherHeight = rect.height || 0
    return container.x <= rect.x && container.y <= rect.y && container.x + container.width >= rect.x + otherWidth && container.y + container.height >= rect.y + otherHeight
}

function merge (rects)
{
    for (var i = 0; i < rects.length; i++)
    {
        var rect = rects[i]
        var j = 0
        var compareRect = rects[i + j]

        while (compareRect)
        {
            if (compareRect === rect)
            {
                j++
            }
            else if (contains(compareRect, rect))
            {
                rects.splice(i, 1)
                rect = rects[i]
                compareRect = null
                continue
            }
            else if (contains(rect, compareRect))
            {
                rects.splice(i + j, 1)
            }
            else
            {
                j++
            }

            compareRect = rects[i + j]
        }
    }
}

function overlaps (a, b)
{
    var aRight = a.x + a.width
    var aBottom = a.y + a.height
    var bRight = b.x + b.width
    var bBottom = b.y + b.height

    return a.x < bRight && aRight > b.x && a.y < bBottom && aBottom > b.y
}

function subtract (a, b, gap)
{
    var free = []
    var aRight = a.x + a.width
    var aBottom = a.y + a.height
    var bRight = b.x + b.width
    var bBottom = b.y + b.height

    if (gap === undefined)
    {
        gap = 0
    }

    // left

    if (a.y < b.y)
    {
        free.push({
            x: a.x,
            y: a.y,
            width: a.width,
            height: b.y - a.y - gap
        })
    }

    // right

    if (aRight > bRight)
    {
        free.push({
            x: bRight + gap,
            y: a.y,
            width: aRight - bRight - gap,
            height: a.height
        })
    }

    // bottom

    if (aBottom > bBottom)
    {
        free.push({
            x: a.x,
            y: bBottom + gap,
            width: a.width,
            height: aBottom - bBottom - gap
        })
    }

    // left

    if (a.x < b.x)
    {
        free.push({
            x: a.x,
            y: a.y,
            width: b.x - a.x - gap,
            height: a.height
        })
    }

    return free
}

function fits (a, b)
{
    return a.width >= b.width && a.height >= b.height
}

function getStrategy (rtl)
{
    return rtl ? {
        sorter: function sorter (a, b)
        {
            return a.y - b.y || a.x - b.x
        },
        place: function place (positioned, space)
        {
            positioned.x = space.x + space.width - positioned.width
            positioned.y = space.y
        }
    } : {
        sorter: function sorter (a, b)
        {
            return a.y - b.y || a.x - b.x
        },
        place: function place (positioned, space)
        {
            positioned.x = space.x
            positioned.y = space.y
        }
    }
}

function packer (size, items, options)
{
    var optionsMerged = {
        gap: 0,
        rtl: false
    }

    Object.assign(optionsMerged, options)

    var spaces = [{
        x: 0,
        y: 0,
        width: size.width || Infinity,
        height: size.height || Infinity
    }]

    var strategy = getStrategy(optionsMerged.rtl)

    return items.map(function (item)
    {
        var positioned = {
            width: item.width || 0,
            height: item.height || 0
        }

        var space = spaces.find(function (space)
        {
            return fits(space, positioned)
        })

        if (space)
        {
            strategy.place(positioned, space)

            var overlapping = spaces.filter(function (space)
            {
                return overlaps(positioned, space)
            })

            overlapping.forEach(function (space)
            {
                spaces.splice(spaces.indexOf(space), 1)
                spaces.push.apply(spaces, subtract(space, positioned, optionsMerged.gap))
            })

            merge(spaces)
            spaces.sort(strategy.sorter)
        }

        return positioned
    })
}

export default packer
