import * as moviesController from '../controllers/movies';
import * as passportConfig from "../config/passport";

export default (router: any) => {
    /**
     * get all movies
     */
    router
        .route('/movies')
        .get(moviesController.getMovies)

    /**
     * get movie by id
     */
    router
        .route('/movies/:id')
        .get(moviesController.getMovieById)

    /**
     * post comment
     */
    router
        .route('/movies/:id/comment')
        .post(passportConfig.auth(), moviesController.postComment)
    
    /**
     * get comments by movie id
     */
    router
        .route('/movies/:id/comments')
        .get(moviesController.getCommentsByMovieId) 
}