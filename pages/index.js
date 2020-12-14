import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { GlobalStateContext, GlobalDispatchContext } from "../context/global";

export default function HomePage() {
  const globalDispatch = useContext(GlobalDispatchContext);
  const globalState = useContext(GlobalStateContext);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // TODO pull posts from db
  const posts = ["test1", "test2"];

  const content = (
    <>
      <div className="container mx-auto">
        <div className="pt-4">
          <span>
            Welcome to my blog! I occasionally post about my interests,
            projects, and plans for the future. Programming, computers, history,
            politics, travel, family and more are all covered to some extent.
            Use the filter to follow only those areas you are interested in.
          </span>
          {/*
          <ol className="list-disc list-inside">
            <li>
              <span className="pr-2">nextjs</span>
              <a href="https://nextjs.org/">https://nextjs.org/</a>
            </li>
            <li>
              <span className="pr-2">tailwind</span>
              <a href="https://tailwindcss.com/">https://tailwindcss.com/</a>
            </li>

            <li>
              <span className="pr-2">fleek</span>
              <a href="https://fleek.co/">https://fleek.co/</a>
            </li>
            <li>
              <span className="pr-2">IPFS</span>
              <a href="https://ipfs.io/">https://ipfs.io/</a>
            </li>
            <li>
              <span className="pr-2">3box</span>
              <a href="https://3box.io/">https://3box.io/</a>
            </li>
            <li>
              <span className="pr-2">orbitDB</span>
              <a href="https://github.com/orbitdb">
                https://github.com/orbitdb
              </a>
            </li>
          </ol>
          */}
        </div>
      </div>
      <div>list of blog articles</div>
      <ul>
        {posts.map((post, key) => (
          <li key={key}>
            <Link href="/[post]" as={`/${post}`}>
              <a>{post}</a>
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/dashboard">
        <a>dashboard</a>
      </Link>
      <div>
        <button onClick={() => globalDispatch("TOGGLE")}>
          Toggle {globalState.value}
        </button>
      </div>
    </>
  );

  if (!mounted) {
    return <div className="invisible">{content}</div>;
  } else {
    return <div>{content}</div>;
  }
}
