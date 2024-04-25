import React from "react";

export default function FileInput({changeHandler}){
    return(
        <input
        id='fileInput'
        type="file"
        name="file"
        accept=".csv"
        onChange={changeHandler}
        multiple="multiple"
        style={{ display: "block", margin: "10px auto" }}
        />
    )
}