import React from 'react'

import Top1 from './Top1'
import Top2 from './Top2'
import Top3 from './Top3'

const LeaderboardTop = ({position} : {position: number}) => {
    return (<>
        {position === 0 && (<Top1/>)}
        {position === 1 && (<Top2/>)}
        {position === 2 && (<Top3/>)}
    </>)
}

export default LeaderboardTop