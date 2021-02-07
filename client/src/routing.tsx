import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Main from './page/main/main'
import Session from './page/session/session'

const Routing = () => {
    return (
        <Switch>
            <Route path="/session">
                <Session />
            </Route>
            <Route path="/">
                <Main />
            </Route>
        </Switch>
    )
}

export default Routing
