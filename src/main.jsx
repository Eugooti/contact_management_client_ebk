import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Provider} from 'react-redux'
import store from './Redux/store.js'
import {BrowserRouter as Router} from 'react-router-dom'
import {DevSupport} from "@react-buddy/ide-toolbox";
import {ComponentPreviews, useInitial} from "./dev/index.js";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Router>
            <Provider store={store}>
                <DevSupport ComponentPreviews={ComponentPreviews}
                            useInitialHook={useInitial}
                >
                    <App/>
                </DevSupport>
            </Provider>

        </Router>

    </StrictMode>,
)
