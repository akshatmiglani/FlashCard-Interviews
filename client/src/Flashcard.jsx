import React, { useState } from 'react'

export const Flashcard = ({flashcard}) => {
  const [flip,setFlip]=useState(false)

    return (
    <>
        <div className={`card ${flip ? 'flip': ' '}`} onClick={()=> setFlip(!flip)}>
            <div className='front'>
                {flashcard.question}
                <div className='options'>
                    {flashcard.options.map(option=>{
                        return <div className='option'>{option}</div>
                    })}
                </div>
            </div>
            <div className='back'>{flashcard.answer}</div>
            {/* {flip ? flashcard.answer:flashcard.questions} */}
        </div>
    </>
  )
}
