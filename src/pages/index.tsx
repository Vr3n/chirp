import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Image from "next/image";
import LoadingPage from "~/components/LoadingPage";
import { useState } from "react";
import LoadingSpinner from "~/components/LoadingSpinner";
import { toast } from "react-hot-toast";
import { PageLayout } from "~/components/Layout";
import PostView from "~/components/PostView";
import { api } from "~/utils/api";
import Link from "next/link";

const CreatePostWizard = () => {
  const { user } = useUser();

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      toast.success("Post created successfully!");
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMsg = e.data?.zodError?.fieldErrors.content;

      if (errorMsg && errorMsg[0]) {
        toast.error(errorMsg[0]);
      }
    },
  });

  const [input, setInput] = useState<string>("");

  if (!user) return null;

  return (
    <div className="flex w-full gap-3">
      <Image
        src={user.profileImageUrl}
        alt="profile_picture"
        className="h-12 w-12 rounded-full"
        height={56}
        width={56}
      />
      <input
        type="text"
        placeholder="what's in your mind?"
        className="w-full rounded-md bg-transparent outline-none"
        value={input}
        disabled={isPosting}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (input !== "") {
              mutate({ content: input });
            }
          }
        }}
      />
      <button onClick={() => mutate({ content: input })} disabled={isPosting}>
        {isPosting ? <LoadingSpinner size={32} /> : "Post"}
      </button>
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: postsLoaded } = api.posts.getAll.useQuery();

  if (!!postsLoaded) return <LoadingPage />;

  if (!data) return <div>Something went wrong!</div>;

  return (
    <section className="flex flex-col">
      {data?.map((fullPost) => (
        <Link key={fullPost.post.id} href={`/post/${fullPost.post.id}`}>
          <PostView {...fullPost} key={fullPost?.post.id} />
        </Link>
      ))}
    </section>
  );
};

const Home: NextPage = () => {
  const { isSignedIn: isUserSignedIn, isLoaded: usersLoaded } = useUser();
  api.posts.getAll.useQuery();

  if (!usersLoaded) return <LoadingPage />;

  return (
    <PageLayout>
      <header className="w-full border-b border-slate-400 p-6">
        <nav>
          <div>{!isUserSignedIn && <SignInButton />}</div>
          <div>{!!isUserSignedIn && <CreatePostWizard />}</div>
        </nav>
        {!!isUserSignedIn && <SignOutButton />}
      </header>
      <Feed />
    </PageLayout>
  );
};

export default Home;
