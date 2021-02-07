import React from 'react'
import { Link } from 'react-router-dom'

const Main = () => {
    return (
        <div>
            <h1>Welcome to TryCode</h1>
            <h5>Click on button for start</h5>
            <button>Start</button>
            <Link to="/session">Start</Link>
        </div>
    )
}

export default Main
