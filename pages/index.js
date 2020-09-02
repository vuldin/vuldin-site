import Link from "next/link";

export default function HomePage() {
  // TODO pull posts from db
  const posts = ["test"];

  return (
    <>
      <div className="container mx-auto">
        <div className="pt-4">
          <span>
            Work in progress! This is just a placeholder while I mess with the
            tools I'm using to make this site. Some of these tools are:
          </span>
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
        </div>
      </div>
      <div>list of blog articles</div>
      <ul>
        <li>
          {posts.map((post, key) => (
            <Link key={key} href="/[post]" as={`/${post}`}>
              <a>{post}</a>
            </Link>
          ))}
        </li>
      </ul>
      <Link href="/dashboard">dashboard</Link>
    </>
  );
}
