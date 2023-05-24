import {
  Action,
  applyMiddleware,
  createStore as reduxCreateStore,
  Middleware,
  Reducer,
} from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'
import { createExplorerConnectionMiddleware } from './middleware'
import reducer from './reducers'
const middleware: Middleware[] = [
  thunkMiddleware,
  createExplorerConnectionMiddleware(),
]

const composeEnhancers = composeWithDevTools({})

function createStoreWith<S, A extends Action>(
  reducer: Reducer<S, A>,
  middleware: Middleware[],
) {
  return reduxCreateStore(
    reducer,
    composeEnhancers(applyMiddleware(...[...middleware])),
  )
}

const createStore = () => createStoreWith(reducer, middleware)
export type StoreDispatch = ReturnType<typeof createStore>['dispatch']

export default createStore
