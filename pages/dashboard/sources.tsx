import { onValue, ref } from 'firebase/database';
import React from 'react';

import { useAuth, useFirebase } from '../../components/FirebaseApp';
import { Loading } from '../../components/ModalDialog';
import { ensure, safe } from '../../lib/typescriptCommonTypes';
import { extractUser } from '../../lib/userUtils';
import type { Actions } from '../../reducers/Sources';
import { reducer } from '../../reducers/Sources';
import type { RefActions, RefStates } from '../../refReducers/Sources';
import { refInitialState, refObjectDispatch } from '../../refReducers/Sources';
import { stateReducer } from '../../stateReducers/Sources';

export default function Sources(): JSX.Element {
  const firebase = useFirebase();
  const { user } = useAuth();
  const refObject = React.useRef<RefStates>(refInitialState);

  const [state, dispatch] = React.useReducer(reducer, {
    type: 'LoadingState',
  });

  const refObjectDispatchCurried = (action: RefActions): void =>
    refObjectDispatch({
      ...action,
      payload: {
        refObject,
        dispatch: (action: Actions) =>
          dispatch({
            ...action,
            payload: {
              firebase,
              user: safe(extractUser(user)),
            },
          }),
      },
    });

  React.useEffect(
    ...ensure(
      (user, firebaseDatabase) => {
        if (state.type !== 'LoadingState') return;

        onValue(
          ref(
            firebaseDatabase,
            `users/${safe(extractUser(user)).uid}/sourcesMeta`
          ),
          (value) =>
            dispatch({
              type: 'LoadedAction',
              userSources: (value.val() as Record<never, unknown>) ?? {},
              user: safe(extractUser(user)),
              refObjectDispatchCurried,
              payload: {
                firebase,
                user: safe(extractUser(user)),
              },
            })
        );
      },
      [user, firebase.firebaseDatabase],
      [state.type]
    )
  );

  if (state.type === 'LoadingState') return <Loading />;

  return stateReducer(<i />, {
    ...state,
    props: {
      dispatch: (action: Actions) =>
        dispatch({
          ...action,
          payload: {
            firebase,
            user: safe(extractUser(user)),
          },
        }),
    },
  });
}
