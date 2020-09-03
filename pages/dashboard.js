import Link from "next/link";
import { GlobalStateContext, GlobalDispatchContext } from "../context/global";

export default function Dashboard() {
  const globalDispatch = React.useContext(GlobalDispatchContext);
  const globalState = React.useContext(GlobalStateContext);

  const active = globalState.value === "active";
  const { count } = globalState.context;

  return (
    <>
      <div>dashboard</div>
      <Link href="/">
        <a>home</a>
      </Link>
      <div>
        <button onClick={() => globalDispatch("TOGGLE")}>
          Toggle {active ? "on" : "off"}
        </button>{" "}
        <code>
          Clicked <strong>{count}</strong> times
        </code>
      </div>
    </>
  );
}
