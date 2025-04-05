import React, {useEffect, useState} from 'react';
import {createBrowserHistory} from 'history'; // Import createBrowserHistory from 'history'
import axios from 'axios';
import CreateAuctionForm from "../../components/createAuctionForm/CreateAuctionForm";
import Header from "../../components/header/Header";

const customHistory = createBrowserHistory(); // Create history instance

const CreateAuctionPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState(0);
    const [startingPrice, setStartingPrice] = useState(0);
    const [thumbnailImage, setThumbnailImage] = useState(null);

    // useEffect(() => {
    //     const handleBeforeUnload = (event) => {
    //         event.preventDefault();
    //         event.returnValue = '';
    //         // 페이지를 떠날 때 사용자가 원하는 행위를 처리할 수 있습니다.
    //         // 예를 들어, 서버에 저장되지 않은 작업이 있을 경우, 이곳에서 처리할 수 있습니다.
    //         // 사용자의 의사에 따라 새로운 동작을 수행해주세요.
    //         // 예시: alert("페이지를 떠납니다!");
    //     };
    //
    //     window.addEventListener('beforeunload', handleBeforeUnload);
    //
    //     return () => {
    //         window.removeEventListener('beforeunload', handleBeforeUnload);
    //     };
    // }, []);
    //
    // const editorConfiguration = {
    //     toolbar: [
    //         'heading',
    //         '|',
    //         'bold',
    //         'italic',
    //         'bulletedList',
    //         'numberedList',
    //         'blockQuote',
    //         'undo',
    //         'redo',
    //     ],
    // };
    //
    // const handleThumbnailChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         setThumbnailImage(file);
    //     }
    // };
    //
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //
    //     const auctionCreateData = new Blob([JSON.stringify({
    //         title       : title,
    //         description : description,
    //         duration    : duration,
    //         startingPrice: startingPrice,
    //     })], {
    //         type: 'application/json',
    //     });
    //
    //     const formData = new FormData();
    //     formData.append('auctionCreate', auctionCreateData);
    //     formData.append('auctionThumbnail', thumbnailImage);
    //
    //     try {
    //         const response = await axios.post('/auction', formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //             },
    //         });
    //
    //         console.log(response.data);
    //         alert('경매가 생성되었습니다.');
    //         window.location.href = '/';  // Redirect to the home page after successful submission
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    return (
        <div className={'create-auction-container'}>
            <Header />
            <CreateAuctionForm/>
        </div>
    );
}

export default CreateAuctionPage;
