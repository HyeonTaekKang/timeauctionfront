import React from "react";
import Header from "../../components/header/Header";
import CreatePostForm from "../../components/createPostForm/CreatePostForm";

const CreatePostPage = () => {

    return (
        <div className={'create-post-container'}>
            <Header />
            <CreatePostForm/>
        </div>
    );
}

export default CreatePostPage;