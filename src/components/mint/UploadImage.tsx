import { UseFormRegister, FieldValues, FieldErrors } from "react-hook-form";

interface UploadImageProps {
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors<FieldValues>;
}

export default function UploadImage({ register, errors }: UploadImageProps) {
    return (
        <>
            <label htmlFor="image-file-upload">Upload Image File: </label>
            <input {...register('image', { required: true })} type="file" id="image-file-upload" accept="image/*" />
            {errors.image && <p>이미지가 필요합니다.</p>}
        </>
    )
}