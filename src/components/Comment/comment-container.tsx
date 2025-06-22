import Link from 'next/link'
import React from 'react'
import styles from './comment-container.module.scss'

export default function CommentContainer() {
    return (
        <div className={`${styles.comment} ${styles[classThemeModule]}`}>
            <Link href={`/user/${commentUser?._doc.userId}`} className={styles.image_comment_container}>
                {commentUser.profileImg !== 'default' && imagesExist[index]
                    ? <img src={commentUser.profileImg} alt="Foto de perfil" onError={()=>handleImagesError(index)}/> 
                    : <DefaultProfileImg/>}
            </Link>
            <div className={styles.body_comment}>
                <div className={styles.header_comment}>
                    <Link href={`/user/${commentUser?._doc.userId}`}>{commentUser?.name}</Link>
                    <p>{getTimeSinceDate(commentUser?._doc.created_at)}</p>
                </div>
                <div className={styles.content_comment}>
                    {!editing && <div className={!showMore ? `${styles.p_container} ${styles.showing}` : `${styles.p_container}`}>
                        <p ref={pElement}>{commentUser._doc.body}</p>
                    </div>}
                    {!editing && exceededContent && <div className={styles.show_more_buttons}>
                        {showMore 
                            ? <button type='button' onClick={e=>setShowMore(false)}>Show more</button>  
                            : <button type='button' onClick={e=>setShowMore(true)}>Show less</button>    
                        }   
                    </div>}
                    {editing && <form onSubmit={handleSubmitEdit}>
                        <input type="text" placeholder={commentValueEdited} value={commentValueEdited} onChange={e=>setCommentValueEdited(e.target.value)} autoFocus max={2000}/>
                        <div className={styles.edit_actions}>
                            <span onClick={handleEdit}><CloseSvg color={'#b7b7b7'}/></span>
                            <button><Send/></button>
                        </div>
                    </form>}
                </div>
                <div className={styles.actions_comment}>
                    {isAuth && <div className={styles.action} onClick={handleReply}>
                        <Reply theme={theme} />
                        <p>Reply</p>
                    </div>}
                    <div className={styles.action} onClick={handleLikeComment}>
                        <Like theme={theme} active={liked}/>
                        <p>{likeCount}</p>
                    </div>
                    {verifyCommentUser() && <>
                        <div className={`${styles.action} ${openOptions ? styles.action_active : ''}`} onClick={handleOptions}>
                            <MoreIcon theme={theme} active={openOptions}/>
                            <p>More</p>
                            {openOptions && <>
                                <ul className={styles.options}>
                                    <li onClick={handleEdit}><ArrowSvg color={theme === 'WHITE' ? 'black' : 'white'}/> Edit</li>
                                    <li onClick={handleRemove}><ArrowSvg color={theme === 'WHITE' ? 'black' : 'white'}/> Remove</li>
                                </ul>
                            </>}
                        </div>
                    </>}
                </div>
                {(replying || arrayReplies.length > 0 || replyCreated || showReplies || replies[commentUser._doc.commentId]) && <>
                    <div className={styles.dynamic_itens}>
                        {replying && <form onSubmit={handleSubmitReply} className={styles.form_reply}>
                            <input type="text" value={replyValue} onChange={e=>setReplyValue(e.target.value)} autoFocus max={2000}/>  
                            <button><Send/></button>  
                        </form>}

                        {(arrayReplies.length > 0 || replyCreated || replies[commentUser._doc.commentId]) && <>
                            
                            <span className={`${styles.show_more} ${showReplies ? styles.show_active : ''}`} onClick={handleShowReplies}>
                                <p>Show {!repliesLength[commentUser._doc.commentId] ? arrayReplies.length : repliesLength[commentUser._doc.commentId]} answers</p>
                                <ArrowSvg color={theme == 'WHITE' ? '#4B4B4B' : '#A0A0A0'}/>
                            </span>

                            {showReplies && <div className={styles.replies}>
                                {replies[commentUser._doc.commentId]?.reply?.map((rep, i, reps)=>(
                                    <ReplyComp key={rep.replyId} replyObject={rep} imagesExist={replyImagesExist} handleImagesError={handleImageReplyError} index={i} commentId={replies[commentUser._doc.commentId].commentId} user={user} quizId={quizId} token={token} handleSetLengthImagesReply={handleSetLengthImagesReply} replies={reps}/>
                                ))}
                            </div>}
                        </>}
                    </div>
                </>}
            </div>
        </div>
    )
}
