"use client";
import Button from "@/app/components/Button";
import Input from "@/app/components/Inputs/Input";
import AuthSocialButton from "./AuthSocialButton";
import { BsGithub, BsGoogle } from "react-icons/bs";
import React, { useCallback, useEffect } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { capitalize } from "@/app/utils/utils";

type Variant = "LOGIN" | "REGISTER";
type SocialAction = "github" | "google";

const AuthForm = () => {
	const session = useSession();
	const router = useRouter();
	const [variant, setVariant] = React.useState<Variant>("LOGIN");
	const [isLoading, setIsLoading] = React.useState(true);

	useEffect(() => {
		setTimeout(() => {
			setIsLoading(false);
		}, 4000);
	}, []);

	useEffect(() => {
		if (session.status === "authenticated") {
			router.push("/users");
		}
	}, [session.status, router]);

	useEffect(() => {
		document.title = `${capitalize(variant.toString())} - Messenger`;
	}, [variant]);

	const buttonRef = React.useRef<HTMLButtonElement>(null);

	const toggleVariant = useCallback(() => {
		if (variant === "LOGIN") {
			setVariant("REGISTER");
		} else {
			setVariant("LOGIN");
		}
	}, [variant]);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FieldValues>({
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	const onSubmit: SubmitHandler<FieldValues> = async (data) => {
		setIsLoading(true);

		if (variant === "REGISTER") {
			toast.promise(
				axios.post("/api/register", data).finally(() => {
					setIsLoading(false);
				}),
				{
					loading: "Registering...",
					success: () => {
						setVariant("LOGIN");
						return (
							<div className="text-center">{"Registration successful!"}</div>
						);
					},
					error: (error) => (
						<div className="text-center">
							{`Registration failed! \n ${error?.response?.data}`}
						</div>
					),
				}
			);
		}

		if (variant === "LOGIN") {
			signIn("credentials", {
				...data,
				redirect: false,
			})
				.then((callback) => {
					if (callback?.error) {
						toast.error(() => (
							<div className="text-center">
								{`Login failed! \n ${callback.error}`}
							</div>
						));
					}

					if (callback?.ok) {
						router.push("/users");

						toast.success(() => (
							<div className="text-center">{"Logged in successfully!"}</div>
						));
					}
				})
				.finally(() => setIsLoading(false));
		}
	};

	const socialAction = (action: SocialAction) => {
		setIsLoading(true);

		signIn(action, {
			redirect: false,
		})
			.then((callback) => {
				if (callback?.error) {
					toast.error(() => (
						<div className="text-center">
							{`Login failed! \n ${callback.error}`}
						</div>
					));
				}

				if (callback?.ok) {
					toast.success(() => (
						<div className="text-center">{"Logged in successfully!"}</div>
					));
				}
			})
			.finally(() => setIsLoading(false));
	};

	return (
		<div
			className="
      mt-8
      sm:mx-auto
      sm:w-full
      sm:max-w-md
    ">
			<div
				className="
        bg-white
        px-4
        py-8
        sm:px-10
        sm:rounded-lg
        shadow
      ">
				<form
					className="
            space-y-6
          "
					onSubmit={handleSubmit(onSubmit)}>
					{variant === "REGISTER" && (
						<Input
							label="Name"
							errors={errors}
							register={register}
							id="name"
							required
							disabled={isLoading}
						/>
					)}
					<Input
						label="Email"
						type="email"
						errors={errors}
						register={register}
						id="email"
						required
						disabled={isLoading}
					/>
					<Input
						label="Password"
						type="password"
						errors={errors}
						register={register}
						id="password"
						required
						disabled={isLoading}
					/>
					<Button
						disabled={isLoading}
						fullWidth
						type="submit"
						ref={buttonRef}
						className="transition-colors duration-150">
						{variant === "REGISTER" ? "Sign up" : "Sign in"}
					</Button>
				</form>

				<div className="mt-6">
					<div className="relative">
						<div
							className="
                absolute 
                inset-0 
                flex 
                items-center
              ">
							<div className="w-full border-t border-gray-300" />
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="bg-white px-2 text-gray-500">
								Or continue with
							</span>
						</div>
					</div>

					<div className="mt-6 flex gap-2">
						<AuthSocialButton
							Icon={BsGithub}
							onClick={() => socialAction("github")}
						/>
						<AuthSocialButton
							Icon={BsGoogle}
							onClick={() => socialAction("google")}
						/>
					</div>
				</div>

				<div
					className="
            flex 
            gap-2 
            justify-center 
            text-sm 
            mt-6 
            px-2 
            text-gray-500
          ">
					<div>
						{variant === "LOGIN"
							? "New to Messenger?"
							: "Already have an account?"}
					</div>
					<Button
						onClick={toggleVariant}
						secondary
						className="underline cursor-pointer !p-0 !m-0">
						{variant === "LOGIN" ? "Create an account" : "Login"}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default AuthForm;
