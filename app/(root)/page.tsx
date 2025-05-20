import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import { dummyInterviews } from "@/constants";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready with AI-Powered Practice</h2>
          <p className="text-lg">
            Practice on real interview question & get instant feedback
          </p>
          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Start an Interview</Link>
          </Button>
        </div>
        <Image src="/robot.png" alt="Robot Dude" width={400} height={400} />
      </section>
      <section className="flex flex-col gap-6 mt-8">
        <h2 className="">
          Your interviews
        </h2>
        <div className="interview-section">
          {dummyInterviews.map((interview) => (
            <InterviewCard {...interview} key={interview.id}/>
          ))}
        </div>
      </section>


      <section>
        <h2>Take an interview </h2>
        <div className="">
          {dummyInterviews.map((interview) => (
            <InterviewCard {...interview} key={interview.id}/>
          ))}
        {/* <p>
          There are no interviews avialable.
        </p> */}
        </div>
      </section>
    </>
  );
}
