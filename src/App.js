import React, { useState, useEffect } from 'react'
import LineChart from './components/LineChart'
import Values from './components/Values'
import SideBar from './components/SideBar'
import ResizableContainer from './components/ResizableContainer'
import './App.css'

const CONFIG_KEY = 'config'

function App() {
    const [values, setValues] = useState([])
    const [isVisible, setIsVisible] = useState({ left: true, right: true })
    const [isYAxisLinear, setIsYAxisLinear] = useState(true) //true means y axis is using linear scale. If false, y axis uses logarithmic scale

    // Retrieve data from local storage
    useEffect(() => {
        const storedData = localStorage.getItem(CONFIG_KEY)
        if (storedData) {
            const data = JSON.parse(storedData)
            const parsedTimestampValues = data.values.map((v) => ({
                ...v,
                timestamp: new Date(v.timestamp),
            }))
            setValues(parsedTimestampValues)
            setIsVisible(data.isVisible)
            setIsYAxisLinear(data.isYAxisLinear)
        }
    }, [])

    const addValue = (value) => {
        const newValues = [...values, { value, timestamp: new Date() }]
        setValues(newValues)
        //save data to local storage
        const data = { values: newValues, isVisible, isYAxisLinear }
        localStorage.setItem(CONFIG_KEY, JSON.stringify(data))
    }

    const removeValue = (timestamp) => {
        const newValues = values.filter((d) => d.timestamp !== timestamp)
        setValues(newValues)
        //save data to local storage
        const data = { values: newValues, isVisible, isYAxisLinear }
        localStorage.setItem(CONFIG_KEY, JSON.stringify(data))
    }

    const togglePanelVisibility = (side) => {
        const newState = {
            ...isVisible,
            [side]: !isVisible[side],
        }
        setIsVisible(newState)
        //save data to local storage
        const data = { values: values, isVisible: newState, isYAxisLinear }
        localStorage.setItem(CONFIG_KEY, JSON.stringify(data))
    }

    const toggleYScale = () => {
        const newState = !isYAxisLinear
        setIsYAxisLinear(newState)
        //save data to local storage
        const data = { values: values, isVisible, isYAxisLinear: newState }
        localStorage.setItem(CONFIG_KEY, JSON.stringify(data))
    }

    return (
        <div className="container">
            <SideBar
                side="left"
                isVisible={isVisible.left}
                onButtonClick={() => togglePanelVisibility('left')}
            />
            <div className="layout">
                <ResizableContainer>
                    {({ dimensions }) => (
                        <LineChart
                            dimensions={dimensions}
                            values={values}
                            isYAxisLinear={isYAxisLinear}
                            isVisible={isVisible}
                        />
                    )}
                </ResizableContainer>
                <Values
                    values={values}
                    addValue={addValue}
                    removeValue={removeValue}
                    isYAxisLinear={isYAxisLinear}
                    onToggleYScale={() => toggleYScale()}
                />
            </div>
            <SideBar
                side="right"
                isVisible={isVisible.right}
                onButtonClick={() => togglePanelVisibility('right')}
            />
        </div>
    )
}

export default App
