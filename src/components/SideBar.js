import React from 'react'
import Arrow from './Arrow'

const SideBar = ({ side, isVisible, onButtonClick }) => {
    return (
        <div className={`sidebar ${isVisible ? '' : `hide-${side}`}`}>
            <button
                className={`btn-${side} ${isVisible ? '' : `btn-${side}__flip`}`}
                onClick={onButtonClick}
            >
                <Arrow />
            </button>
        </div>
    )
}

export default SideBar
