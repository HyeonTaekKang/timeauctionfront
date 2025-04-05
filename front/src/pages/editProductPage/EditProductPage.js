import React from "react";
import Header from "../../components/header/Header";
import EditProductForm from "../../components/editProductForm/EditProductForm";

const EditProductPage = () => {
    return (
        <div className={'edit-product-container'}>
            <Header />
            <EditProductForm/>
        </div>
    );
};

export default EditProductPage;