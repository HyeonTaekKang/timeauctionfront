import React from 'react';
import { SyncLoader } from 'react-spinners';

const LoadingSpinner = () => {
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <SyncLoader color="#ffffff" />
                <h3 style={{ color: '#ffffff', marginTop: '16px' }}>잠시만 기다려주세요.</h3>
            </div>
        </div>
    );
};

export default LoadingSpinner;