"use client";

import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";
import MessageInput from "./MessageInput";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { CldUploadButton } from "next-cloudinary";
import useConversation from "@/app/hooks/useConversation";
import toast from "react-hot-toast";
import clsx from "clsx";
import { useState } from "react";

const Form = () => {
	const [isMessageBeingSent, setIsMessageBeingSent] = useState(false);
	const { conversationId } = useConversation();

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<FieldValues>({
		defaultValues: {
			message: "",
		},
	});

	const onSubmit: SubmitHandler<FieldValues> = async (data) => {
		setIsMessageBeingSent(true);
		setValue("message", "", { shouldValidate: true });
		axios
			.post("/api/messages", {
				...data,
				conversationId: conversationId,
			})
			.catch((error: AxiosError) =>
				toast.error(() => (
					<div className="text-center">
						{`Message Could not be sent! \n ${error?.response?.data}`}
					</div>
				))
			)
			.finally(() => setIsMessageBeingSent(false));
	};

	const handleUpload = (result: any) => {
		setIsMessageBeingSent(true);
		axios
			.post("/api/messages", {
				image: result?.info?.secure_url,
				conversationId: conversationId,
			})
			.catch((error: AxiosError) => (
				<div className="text-center">
					{`Message Could not be sent! \n ${error?.response?.data}`}
				</div>
			))
			.finally(() => setIsMessageBeingSent(false));
	};

	return (
		<div
			className="
        py-4 
        px-4 
        bg-white 
        border-t 
        flex 
        items-center 
        gap-2 
        lg:gap-4 
        w-full
      ">
			<CldUploadButton
				options={{ maxFiles: 1 }}
				onUpload={handleUpload}
				uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}>
				<HiPhoto size={30} className="text-sky-500" />
			</CldUploadButton>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex items-center gap-2 lg:gap-4 w-full">
				<MessageInput
					id="message"
					register={register}
					errors={errors}
					required
					placeholder="Write a message"
				/>
				<button
					type="submit"
					disabled={isMessageBeingSent}
					className={clsx(
						"rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition-all",
						isMessageBeingSent && "opacity-50"
					)}>
					{!isMessageBeingSent ? (
						<HiPaperAirplane size={24} className="text-white" />
					) : (
						<div className="border-white rounded-full border-t-transparent bg-transparent h-6 w-6 animate-spin transition-all border-2" />
					)}
				</button>
			</form>
		</div>
	);
};

export default Form;
