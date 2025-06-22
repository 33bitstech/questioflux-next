import React from 'react'

interface IProps {
    params: {
        quizId: string
    }
}

export default async function Leaderboard({params}:IProps) {
    const {quizId} = await params

    return <p>lb:{quizId}</p>
    /* return (
        <div className={styles.leaderboard_container}>
            {quizLb.slice(0,10).map((userLb, index)=>(
                <div className={styles.user_results} key={index}>
                    <div className={styles.user}>
                        <div className={styles.user_images}>
                            <div className={styles.rank}>
                                {index <= 2 ? <LeaderboardTop position={index}/> : <span>{index+1}</span>}
                            </div>
                            <div className={styles.profileImg}>
                                {userLb.profileImg !== 'default' && imageExist[index]
                                    ? <img src={userLb.profileImg} alt="Foto de perfil" onError={()=>handleImageError(index)}/> 
                                    : <DefaultProfileImg/>}
                            </div>
                        </div>
                        <Link to={`/user/${userLb.userId}`}>{userLb.name}</Link>
                    </div>
                    <div className={styles.result}>
                        <span onClick={()=>{
                            if (userCanSeeAnswers || userLb.userId === user?.userId) handleAnswersArea(index)
                        }} className={styles.score}>{userLb.score}</span>
                        <span className={styles.time}>{getTimeString(userLb.timing)}</span>
                    </div>
                    {showResults[index] && <>
                        <ResultsUser quiz_type={quiz?.type} results={userLb?.result} name={userLb?.name} attempts={userLb?.attempts} handleAnswersArea={handleAnswersArea} index={index}/>
                        <div onClick={()=>handleAnswersArea(index)} className={styles.overlay_result}></div>
                    </>}
                </div>
            ))}
            {userInLeaderboard && userPosition > 10 && (
                    <div className={styles.user_results}>
                        <div className={styles.user}>
                            <div className={styles.user_images}>
                                <div className={styles.rank}>
                                    <span>+{userPosition}</span>
                                </div>
                                <div className={styles.profileImg}>
                                    {user.profileImg !== 'default'
                                        ? <img src={user.profileImg} alt="Foto de perfil" onError={()=>handleImageError(userPosition)}/>
                                        : <DefaultProfileImg/>}
                                </div>
                            </div>
                            <Link to={`/user/${user.userId}`}>{user.name}</Link>
                        </div>
                        <div className={styles.result}>
                            <span onClick={()=>{
                                handleAnswersArea(userPosition-1)
                            }} className={styles.score}>{quizLb[userPosition-1].score}</span>
                            <span className={styles.time}>{getTimeString(quizLb[userPosition-1].timing)}</span>
                        </div>
                        {showResults[userPosition-1] && <>
                            <ResultsUser quiz_type={quiz?.type} results={quizLb[userPosition-1]?.result} name={quizLb[userPosition-1]?.name} attempts={quizLb[userPosition-1]?.attempts} handleAnswersArea={handleAnswersArea} index={userPosition-1}/>
                            <div onClick={()=>handleAnswersArea(userPosition-1)} className={styles.overlay_result}></div>
                        </>}
                    </div>
                )}
        </div>
    ) */
}
