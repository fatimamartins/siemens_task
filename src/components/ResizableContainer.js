import React, { useRef, useState, useEffect } from 'react'

const ResizableContainer = ({ children }) => {
    const ref = useRef()
    const [dimensions, setDimensions] = useState(null)

    useEffect(() => {
        const handleResize = (entries) => {
            for (let entry of entries) {
                setDimensions({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height,
                })
            }
        }

        const resizeObserver = new ResizeObserver(handleResize)

        const cur = ref.current
        if (cur) {
            resizeObserver.observe(cur)
        }

        // Cleanup on unmount
        return () => {
            if (cur) {
                resizeObserver.unobserve(cur)
            }
        }
    }, [])

    return (
        <div ref={ref} style={{ flexGrow: 1, width: 'auto', height: '99%' }}>
            {children({ dimensions })}
        </div>
    )
}

export default ResizableContainer
