"use client";

import React, { ComponentProps } from "react";
// The below line was original from the video
// import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { useFormStatus } from "react-dom";

type FormSubmitButtonProps = {
    children : React.ReactNode,
    className? : string,
} & ComponentProps <"button">

export default function FormSubmitButton({
    children, 
    className,
    ...props
} : FormSubmitButtonProps
) {
    const {pending} = useFormStatus();
    return(

        <button
        {...props}
        className={`btn btn-primary ${className}`}
        type="submit"
        disabled={pending}
        >
            {pending && <span className="loading loading-infinity" />}
            {children}</button>
    )
}