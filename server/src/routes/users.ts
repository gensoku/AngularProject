import * as usersController from '../controllers/user';
import * as passportConfig from "../config/passport";

export default (router: any) => {
    /**
     * login
     */
    router
        .route('/login')
        .get(usersController.login)

    /**
     * logout
     */
    router
        .route('/logout')
        .get(usersController.logout)

    /**
     * Signup
     */
    router
        .route('/account/register')
        .post(usersController.postSignup)
    
    /**
     * get Profile
     */
    router
        .route('/account/:id/profile')
        .get(passportConfig.isAuthenticated, usersController.getProfile)

    /**
     * patch profile
     */
    router
        .route('/account/:id/profile')
        .patch(passportConfig.isAuthenticated, usersController.updateProfile)
    
    /**
     * delete account
     */
    router
        .route('/account/:id')
        .delete(passportConfig.isAuthenticated, usersController.deleteAccount)
}