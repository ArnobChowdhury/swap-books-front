import thunk from 'redux-thunk';
import moxios from 'moxios';
import { authRequest } from '../actions/auth';
import axiosInstance from '../../axiosInstance';
import rootReducer, { RootState } from '../reducers';
import { MakeStore, Context } from 'next-redux-wrapper';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

/**
 * todo
 * So at this momemnt (18th July 2020), I do not know much about how the redux store is going to look
 * in the long run with server side rendering and all that. So, For now we are not doing any integration
 * tests related to redux. But keeping this as proof of concept.
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const makeStore: MakeStore<RootState> = (_context: Context = {}) => {
  return createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
};

describe('Action integration', () => {
  beforeEach(() => {
    moxios.install(axiosInstance);
  });

  afterEach(() => {
    moxios.uninstall(axiosInstance);
  });

  it('Sign in is possible', () => {
    const testToken = 'testToken';
    const testId = 'testId';
    const mockedResponse = {
      token: testToken,
      userId: testId,
    };

    const store = makeStore({});

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: mockedResponse,
      });
    });

    const mockFunc = jest.fn();

    return store
      .dispatch(
        // @ts-ignore
        authRequest('testemail@gmail.com', 'testpassword', false, mockFunc),
      )
      .then(() => {
        const newState = store.getState();
        expect(newState.auth.token).toEqual(testToken);
        expect(newState.auth.userId).toEqual(testId);
        expect(mockFunc).toBeCalledWith(false);
      });
  });
});
