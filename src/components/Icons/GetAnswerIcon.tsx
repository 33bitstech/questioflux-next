import React from 'react'

const GetAnswerIcon = ({type}: {type:string}) => {
    return (
        <>
            {type === 'correct' && (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="11" fill="#039855"/>
                <path d="M6 10.3077L9.84615 13.7692L16 8" stroke='var(--background-divs)' strokeWidth="2.30769" strokeLinecap="round"/>
                </svg>
            )}  
            {type === 'incorrect' && (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="11" fill="#D92D20"/>
                <path d="M7.33252 6L14.8325 15" stroke='var(--background-divs)' strokeWidth="2" strokeLinecap="round"/>
                <path d="M14.8633 6.02539L7.30237 14.9743" stroke='var(--background-divs)' strokeWidth="2" strokeLinecap="round"/>
                </svg>                
            )}
        </>
    )
}

export default GetAnswerIcon