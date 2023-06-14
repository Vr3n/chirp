import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";
import type { RouterOutputs } from "~/utils/api";

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div className="flex gap-4 border-b border-slate-400 p-6">
      <Image
        src={author?.profileImageUrl}
        alt="profile_picture"
        className="h-12 w-12 rounded-full"
        height={56}
        width={56}
      />
      <span className="flex flex-col gap-3">
        <span className="flex items-center gap-2">
          {author?.username ? (
            <Link href={`/@${author.username}`}>
              <p className="text-slate-400">@{author.username}</p>
            </Link>
          ) : (
            <p className="text-slate-400">@{author.username}</p>
          )}
          ·
          <span className="text-sm text-slate-400">{`${dayjs(
            post.createdAt
          ).fromNow()}`}</span>
        </span>
        <article key={post.id}>{post.content}</article>
      </span>
    </div>
  );
};

export default PostView;
