import { SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { Loading } from "~/components/Loading";
import { useState } from "react";
import Link from "next/link";

dayjs.extend(relativeTime);

const CreatePostWithard = () => {
  const { user } = useUser();
  const [emoji, setEmoji] = useState("");

  const ctx = api.useContext();
  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setEmoji("");
      void ctx.posts.getAll.invalidate();
    },
  });

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
        type="text"
        value={emoji}
        onChange={({ target }) => setEmoji(target.value)}
        disabled={isPosting}
      />
      <button onClick={() => mutate({ content: emoji })}>Save</button>
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
          <Link href={`/@${author.username}`}>
            <span>{`@${author.username}`}</span>
          </Link>
          <Link href={`posts/${post.id}`}>
            <span className="font-thin">{`- ${dayjs(
              post.createdAt
            ).fromNow()}`}</span>
          </Link>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
  );
};

export const Feed = () => {
  const { data, isLoading: arePostsLoading } = api.posts.getAll.useQuery();

  if (arePostsLoading) return <Loading />;
  if (!data) return <div>Data is missing</div>;

  return (
    <div>
      {data.map(({ post, author }) => (
        <PostView key={post.id} post={post} author={author} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  const { isLoaded, isSignedIn } = useUser();
  api.posts.getAll.useQuery();

  if (!isLoaded) return <div />;

  return (
    <>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x border-gray-600 md:max-w-2xl">
          <div className="border-b border-gray-600 p-4">
            <div className="flex">
              {!isSignedIn && <SignInButton />}
              {isSignedIn && <CreatePostWithard />}
            </div>
          </div>

          <Feed />
        </div>
      </main>
    </>
  );
};

export default Home;
