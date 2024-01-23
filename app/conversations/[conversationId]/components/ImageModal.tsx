"use client";

import Modal from "@/app/components/modals/Modal";
import Image from "next/image";

interface ImageModalProps {
	isOpen?: boolean;
	onClose: () => void;
	src?: string | null;
}

const ImageModal = ({ isOpen, onClose, src }: ImageModalProps) => {
	if (!src) {
		return null;
	}

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<div className="w-auto h-80">
				<Image className="object-contain" fill alt="Image" src={src} />
			</div>
		</Modal>
	);
};

export default ImageModal;
