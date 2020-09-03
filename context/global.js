import React from "react";
import { useMachine } from "@xstate/react";
import { Machine, assign } from "xstate";

export const GlobalStateContext = React.createContext();
export const GlobalDispatchContext = React.createContext();

const toggleMachine = Machine({
  id: "toggle",
  initial: "inactive",
  context: {
    count: -1,
  },
  states: {
    inactive: {
      entry: assign({ count: (ctx) => ctx.count + 1 }),
      on: { TOGGLE: "active" },
    },
    active: {
      entry: assign({ count: (ctx) => ctx.count + 1 }),
      on: { TOGGLE: "inactive" },
    },
  },
});

export const GlobalContextProvider = ({ children }) => {
  const [state, send] = useMachine(toggleMachine);

  return (
    <GlobalStateContext.Provider value={state}>
      <GlobalDispatchContext.Provider value={send}>
        {children}
      </GlobalDispatchContext.Provider>
    </GlobalStateContext.Provider>
  );
};
