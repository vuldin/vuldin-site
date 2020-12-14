import { useContext } from "react";
import Link from "next/link";
import { GlobalStateContext, GlobalDispatchContext } from "../context/global";

export default function Dashboard() {
  const globalDispatch = useContext(GlobalDispatchContext);
  const globalState = useContext(GlobalStateContext);

  return (
    <>
      <div>dashboard</div>
      <Link href="/">
        <a>home</a>
      </Link>
      <div>
        <button onClick={() => globalDispatch("TOGGLE")}>
          Toggle {globalState.value}
        </button>
      </div>
    </>
  );
}
