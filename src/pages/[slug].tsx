import type { GetStaticProps, NextPage } from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import Head from "next/head";
import LoadingPage from "~/components/LoadingPage";
import { api } from "~/utils/api";
import { appRouter } from "~/server/api/root";
import superjson from "superjson";
import { prisma } from "~/server/db";
import { PageLayout } from "~/components/Layout";
import Image from "next/image";
import Link from "next/link";
import { MoveLeft } from "lucide-react";
import PostView from "~/components/PostView";

const ProfileFeed = (props: { userId: string }) => {
  const { data, isLoading: postsLoading } = api.posts.getPostsByUserId.useQuery(
    {
      userId: props.userId,
    }
  );

  if (postsLoading) return <LoadingPage />;

  if (!data || data.length === 0)
    return (
      <div>
        <h2 className="text-xl">User hasn&apos;t posted anything.</h2>
      </div>
    );

  return (
    <div className="flex flex-col">
      {data.map((fullPost) => {
        return <PostView key={fullPost.post.id} {...fullPost} />;
      })}
    </div>
  );
};

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data, isLoading: userLoading } =
    api.profile.getUserByUsername.useQuery({
      username,
    });

  // start fetching asap.
  api.posts.getAll.useQuery();

  if (userLoading) return <LoadingPage />;

  if (!data)
    return (
      <PageLayout>
        <h1 className="text-2xl">404 User Not Found!</h1>
      </PageLayout>
    );

  return (
    <>
      <Head>
        <title>Chirp | Profile</title>
      </Head>
      <PageLayout>
        <section className="relative h-48 border-slate-400 bg-slate-600">
          <Image
            src={data.profileImageUrl}
            alt={`@${data.username ?? ""}'s profile picture`}
            className="absolute bottom-0 left-0 -mb-12 ml-4 rounded-full border-4 border-black"
            width={96}
            height={96}
          />
          <header className="bg-black py-2">
            <nav className="ml-4 flex items-center gap-8">
              <Link href="/">
                <MoveLeft size={18} />
              </Link>
              <h2 className="text-2xl">{data.username}</h2>
            </nav>
          </header>
        </section>
        <div className="h-[38px]" />
        <section className="border-b border-slate-400 px-6 py-4">
          <h2 className="text-bold text-2xl">{`@${data.username ?? ""}`}</h2>
        </section>
        <ProfileFeed userId={data.id} />
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson,
  });

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  const username = slug.replace("@", "");

  await helpers.profile.getUserByUsername.prefetch({ username: username });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default ProfilePage;
