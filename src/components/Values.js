import React, { useState } from 'react'

const Values = ({ values, addValue, removeValue, isYAxisLinear, onToggleYScale }) => {
    const [inputValue, setInputValue] = useState('')

    const handleOnChange = (e) => {
        const { value } = e.target
        setInputValue(value)
    }

    return (
        <div className="data-area">
            <div className="data-area__values">
                <h5>Data</h5>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        addValue(parseInt(inputValue, 10))
                        setInputValue('')
                    }}
                >
                    <input
                        name="number"
                        type="number"
                        value={inputValue}
                        onChange={handleOnChange}
                    />
                </form>
                <h6>List of values</h6>
                <ul className="list-of-values">
                    {values.map((v) => (
                        <li key={v.timestamp.getTime()}>
                            <div>
                                <p>
                                    {v.timestamp.getMinutes()}:{v.timestamp.getSeconds()}:
                                    {v.timestamp.getMilliseconds()}
                                </p>
                                <p>{v.value}</p>
                            </div>
                            <button onClick={() => removeValue(v.timestamp)}>Remove</button>
                        </li>
                    ))}
                </ul>
            </div>
            <button onClick={onToggleYScale}>{`Switch to ${
                isYAxisLinear ? 'logarithmic' : 'linear'
            } Y axis`}</button>
        </div>
    )
}

export default Values
