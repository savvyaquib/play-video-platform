import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {

    const { tweet } = req.body
    const owner = req.user._id

    if (!tweet) {
        throw new ApiError(404, "Tweet is required")
    }

    const newTweet = await Tweet.create(
        {
            owner: owner,
            tweet: tweet
        }
    )

    if (!newTweet) {
        throw new ApiError(404, "Something went wrong while publishing tweet")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, newTweet, "Your tweet published successfully"))

})

const getUserTweets = asyncHandler(async (req, res) => {

    const { userId } = req.params

    if (!isValidObjectId(userId)) {
        throw new ApiError(404, "Invalid userId")
    }

    const userTweets = await Tweet.find({ owner: userId })
    console.log(userTweets)

    return res
        .status(200)
        .json(new ApiResponse(200, userTweets, "User's tweet fetched successfully"))
})

const updateTweet = asyncHandler(async (req, res) => {

    const { tweetId } = req.params
    const { tweet } = req.body

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(404, "Invalid tweetId")
    }

    const updatedTweet = await Tweet.findOneAndUpdate({ _id: tweetId, owner: req.user._id },
        { tweet: tweet },
        { new: true }
    )

    if (!updatedTweet) {
        throw new ApiError(404, "Tweet not found or you are not the owner")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"))
})

const deleteTweet = asyncHandler(async (req, res) => {

    const { tweetId } = req.params

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(404, "Invalid tweetId")
    }

    const deletedTweet = await Tweet.findOneAndDelete({ _id: tweetId, owner: req.user._id })

    if (!deletedTweet) {
        throw new ApiError(404, "Tweet not found or you are not the owner")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, deletedTweet, "Tweet deleted successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}