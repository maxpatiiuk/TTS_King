/*
*
* Generator of type safe-reducer and dispatches
* Replaces the need for switch(){} statements
* This code is based on https://github.com/maxxxxxdlp/typesafe_reducer
*
* */

'use strict';

export type Action<
  ACTION_NAME extends string,
  ACTION_CONTENT extends Record<string, unknown> = {}
> = { type: ACTION_NAME} & ACTION_CONTENT;

export type State<
  STATE_NAME extends string,
  STATE_CONTENT extends Record<string, unknown> = {}
> = { type: STATE_NAME} & STATE_CONTENT;

type GenerateReducerDictionary<STATE, ACTION extends Action<string>> = {
  [actionType in ACTION['type']]: (props: {
    state: STATE,
    action: Extract<ACTION, Action<actionType>>
  }) => STATE
}

type GenerateDispatchDictionary<ACTION extends Action<string>> = {
  [actionType in ACTION['type']]: (
    action: Extract<ACTION, Action<actionType>>,
  ) => void
}

function assertExhaustive(caseType: never): never {
  throw new Error(`Non-exhaustive switch. Unhandled case: ${
    caseType as string
  }`);
}


// assignees names to components so that they easier to identify in the
// inspector and profiler
export function namedComponent<T>(component: T, name: string): T {
  // @ts-ignore
  component.displayName = name;
  return component;
}

export const generateReducer = <STATE,
  ACTION extends Action<string>>(
  obj: GenerateReducerDictionary<STATE, ACTION>,
): (state: STATE, key: ACTION) => STATE =>
  <Key2 extends keyof typeof obj>(
    state: STATE,
    action: Action<Key2>,
  ) =>
    typeof obj[action['type']] === 'function' ?
      obj[action['type']]({state, action: action as any}) :
      assertExhaustive(action['type'] as never);

export const generateDispatch = <ACTION extends Action<string>>(
  obj: GenerateDispatchDictionary<ACTION>,
): (key: ACTION) => void =>
  <Key2 extends keyof typeof obj>(
    action: Action<Key2>,
  ) =>
    typeof obj[action['type']] === 'function' ?
      obj[action['type']](action as any) :
      assertExhaustive(action['type'] as never);