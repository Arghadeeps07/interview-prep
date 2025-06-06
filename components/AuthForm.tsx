"use client";

import { z } from "zod";
import React from "react";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import FormField from "./FormField";
import { Form } from "./ui/form";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/actions/auth.action";
import { auth } from "@/firebase/client";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      
      if (type === "sign-up") {
        const { name, email, password } = values;
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password
        });

        if(!result?.success) {
          toast.error(result?.message);
          return
        }


        toast.success("Account Created successfully.");
        router.push("/sign-in");


      } else {

        const {email, password} = values;
        const userCredentials = await signInWithEmailAndPassword(auth, email, password)

        const idToken = await userCredentials.user.getIdToken();

        if(!idToken){
          toast.error('Sign in failed')
          return
        }
        await signIn({
          email, idToken
        })
        toast.success("Sign in Succesfull");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was an error occured: ${error}`);
    }
  }

  const isSignIn = type === "sign-in";
  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100"> PrepWise</h2>
        </div>
        <h3>Practice job interviews</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your Name"
              />
            )}
            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Email"
              type="email"
            />
            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Password"
              type="password"
            />
            <Button type="submit"> {isSignIn ? "Sign in" : "Sign up"} </Button>
          </form>
        </Form>
        <Link
          href={isSignIn ? "/sign-up" : "sign-in"}
          className="font-bold text-user-primary ml-1"
        >
          <p className="text-center ">
            {isSignIn ? "No account yet ? " : "Have account already ?"}
          </p>
        </Link>
      </div>
    </div>
  );
};

export default AuthForm;
