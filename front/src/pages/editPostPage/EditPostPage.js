import React from "react";
import Header from "../../components/header/Header";
import EditPostForm from "../../components/editPostForm/EditPostForm";

const EditProductPage = () => {
    return (
        <div className={'edit-post-container'}>
            <Header />
            <EditPostForm/>
        </div>
    );
};

export default EditProductPage;