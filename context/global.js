import React, { useEffect, useState } from "react";
import { useMachine } from "@xstate/react";
import { Machine } from "xstate";

export const GlobalStateContext = React.createContext();
export const GlobalDispatchContext = React.createContext();

const themeMachine = Machine(
  {
    id: "theme",
    initial: "dark",
    states: {
      light: {
        exit: ["setDark", "storeDark"],
        on: {
          TOGGLE: {
            target: "dark",
          },
        },
      },
      dark: {
        exit: ["setLight", "storeLight"],
        on: {
          TOGGLE: {
            target: "light",
          },
        },
      },
    },
  },
  {
    actions: {
      storeLight: (context, event) => {
        localStorage.setItem("theme", "light");
      },
      setDark: (context, event) => {
        document.querySelector("html").classList.add("dark");
      },
      setLight: (context, event) => {
        document.querySelector("html").classList.remove("dark");
      },
      storeDark: (context, event) => {
        localStorage.removeItem("theme");
      },
    },
  }
);

export const GlobalContextProvider = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  try {
    // on client
    const htmlClass = document.querySelector("html").className;

    const persistedState = themeMachine.initialState;

    const [state, send] = useMachine(themeMachine, {
      state: {
        ...persistedState,
        value: htmlClass.length > 0 ? "dark" : "light",
      },
    });

    const body = (
      <GlobalStateContext.Provider value={state}>
        <GlobalDispatchContext.Provider value={send}>
          {children}
        </GlobalDispatchContext.Provider>
      </GlobalStateContext.Provider>
    );

    if (mounted) {
      return <div>{body}</div>;
    } else {
      // avoid failure to render due to mismatching content between server/client
      return <div className="invisible">{body}</div>;
    }
  } catch (e) {
    // on server
    const [state, send] = useMachine(themeMachine);

    const body = (
      <GlobalStateContext.Provider value={state}>
        <GlobalDispatchContext.Provider value={send}>
          {children}
        </GlobalDispatchContext.Provider>
      </GlobalStateContext.Provider>
    );

    return <div className="invisible">{body}</div>;
  }
};
