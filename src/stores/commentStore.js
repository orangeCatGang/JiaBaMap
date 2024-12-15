import { defineStore } from "pinia"

export const useCommentStore = defineStore('commentStore',
    {
        state: () => ({
            comments: [],
        }),
        actions: {
            addComment(newComment){
                this.comments.unshift(newComment)
            }
        }
    }
)