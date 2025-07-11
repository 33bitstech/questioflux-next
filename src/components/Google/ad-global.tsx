'use client';

import Script from 'next/script';

const AdGlobal = () => {
    if (process.env.NODE_ENV!== 'production') {
        return null;
    }

    return (
        <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7383504438544213`}
            crossOrigin="anonymous"
            strategy="lazyOnload"
        />
    );
};

export default AdGlobal;