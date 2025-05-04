import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { File } from "lucide-react";
import { CourseProgressButton } from "./_components/course-progress-button";
import { AskQuestion } from "./_components/askQuestion";
import { getChapterDetails } from "@/actions/get-chapter-details";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

const ChapterIdPage = async ({
  params,
}: {
  params: {
    courseId: string;
    chapterId: string;
  };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const [chapterData, chapterDetailsData] = await Promise.all([
    getChapter({
      userId,
      chapterId: params.chapterId,
      courseId: params.courseId,
    }),
    getChapterDetails({
      userId,
      chapterId: params.chapterId,
      courseId: params.courseId,
    }),
  ]);

  const {
    chapter,
    course,
    muxData,
    attachements,
    nextChapter,
    userProgress,
    purchase,
    enrolled,
  } = chapterData;

  const { chapterDetails, courseDetails } = chapterDetailsData;

  if (!chapter || !course) {
    return redirect("/");
  }

  const videoUrl = chapter?.videoUrl || "";

  const isLocked = !chapter.isFree && !enrolled;
  const completeOnEnd = !!enrolled && !userProgress?.isCompleted;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner variant="success" label="You already completed this chapter" />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="You need to enrolled for this course to watch this chapter"
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={params.chapterId}
            title={chapter.title}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
            videoUrl={videoUrl}
          />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
            {enrolled ? (
              <CourseProgressButton
                chapterId={params.chapterId}
                courseId={params.courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
            ) : (
              <CourseEnrollButton courseId={params.courseId} />
            )}
          </div>
          <Separator />
          <div className="p-5 overflow-y-auto">
            <Preview value={chapter.description!} />
          </div>
          {!!attachements.length && (
            <>
              <Separator />
              <div className="p-4">
                <p className="font-semibold text-base pb-2">
                  Course Attachments
                </p>
                {attachements.map((attachement) => (
                  <a
                    href={attachement.url}
                    target="_blank"
                    key={attachement.id}
                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline "
                  >
                    <File />
                    <p className="line-clamp-1">{attachement.name}</p>
                  </a>
                ))}
              </div>
            </>
          )}

          <div>
            <AskQuestion
              chapterId={params.chapterId}
              courseId={params.courseId}
              userId={userId}
              courseDetails={courseDetails || null}
              chapterDetails={chapterDetails || null}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-sky-700" />
    </div>
  );
};

export default function ChapterPageWithSuspense({
  params,
}: {
  params: {
    courseId: string;
    chapterId: string;
  };
}) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ChapterIdPage params={params} />
    </Suspense>
  );
}
