import csrfFetch from "./csrf";
import {addUser} from "./users"
import {receiveProduct, RECEIVE_PRODUCT} from "./products"

const ADD_REVIEW = `reviews/ADD_REVIEW`
const ADD_REVIEWS =  `reviews/ADD_REVIEWS`
const REMOVE_REVIEWS = `reviews/REMOVE_REVIEWS`

const addReview = review => ({
    type: ADD_REVIEW,
    payload: review
})
const removeReview = review => ({
    type: REMOVE_REVIEWS,
    payload: review
})

export const addReviews = reviews => ({
    type: ADD_REVIEWS,
    payload: reviews
})

export const getProductReviews = productId => state => {
    Object.values(state.reviews)
            .filter(review=> review.productId === parseInt(productId))
            .map(review => ({
            ...review, author: state.users[review.authorId] ?. username
            }))
};

export const createReview = (review) => async dispatch => {
    
    console.log("hi from before csrfFetch")
    const res = await csrfFetch("/api/reviews", {
        method: "POST",
        body: JSON.stringify(review),
        headers: {
            "Content-Type": 'application/json',
            // "Accept" : 'application/json'
        }
    });

    const reviewData = await res.json()
    dispatch(addReview(reviewData))
    // dispatch(addUser(reviewData.addUser))
    // dispatch(receiveProduct(reviewData.product))
    return res
}

export const updateReview = (review) => async dispatch => {
    const res = await csrfFetch(`api/reviews/${review.id}`, {
        method : "PATCH",
        body: JSON.stringify(review),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (res.ok){
        const review = await res.json()
        dispatch(addReview(review))
    }
}

export const destroyReview = (reviewId) => async dispatch => {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
    })
    // const reviewData = await res.json();
    // dispatch(removeReview(reviewData.review))
    dispatch(removeReview(reviewId))
    // dispatch(receiveProduct(reviewData.product))
    // return res
}

const reviewsReducer = (state={}, action) => {
    Object.freeze(state)
    const newState = {...state}
    switch(action.type){
        case ADD_REVIEW:{
            const review = action.payload;
            return { ...state, [review.id]: review}
        }
        case ADD_REVIEWS:{
            return action.payload.review;
        }
        case REMOVE_REVIEWS:{
            // const review = action.payload;
            // const { [review.id]: _remove, ...newState } = state;
            // return newState
            delete newState[action.payload]
            return newState
        }
        case RECEIVE_PRODUCT: {
            if (action.payload.reviews) {
                return action.payload.reviews
            } else {
                return state;
            }
        }
        default:
            return state;
    }    
}

export default reviewsReducer;
