import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
// import Box from "3box";

export default function PostPage() {
  // const box = useRef();
  const router = useRouter();
  const { post } = router.query;

  useEffect(() => {
    /*
    async function init() {
      box.current = await Box.create();
    }

    init();
    */
  }, []);

  return <h1>Post: {post}</h1>;
}
