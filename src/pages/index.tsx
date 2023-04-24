import { SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
dayjs.extend(relativeTime);

const CreatePostWithard = () => {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="flex w-full gap-4 ">
      <Image
        alt="Profile image"
        src={user.profileImageUrl}
        className="h-14 w-14 rounded-full"
        width={56}
        height={56}
      />
      <input
        placeholder="Type some emojis!"
        className="w-full bg-transparent outline-none"
      />
    </div>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div className="flex gap-3 border-b border-gray-600 p-4" key={post.id}>
      <Image
        alt="Profile image"
        src={author.profileImageUrl}
        className="h-14 w-14 rounded-full"
        width={56}
        height={56}
      />
      <div className="flex flex-col">
        <div className="flex gap-2 text-slate-400">
          <span>{`@${author.username}`}</span>
          <span className="font-thin">{`- ${dayjs(
            post.createdAt
          ).fromNow()}`}</span>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const { data, isLoading } = api.posts.getAll.useQuery();
  const user = useUser();
  if (isLoading) return <div>Loading ...</div>;
  if (!data) return <div>Data is missing</div>;
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x border-gray-600 md:max-w-2xl">
          <div className="border-b border-gray-600 p-4">
            <div className="flex">
              {!user.isSignedIn && <SignInButton />}
              {user.isSignedIn && <CreatePostWithard />}
            </div>
          </div>
          <div>
            {[...data, ...data]?.map(({ post, author }) => (
              <PostView key={post.id} post={post} author={author} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
