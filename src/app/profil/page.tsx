'use client';

import ProfilePage from '../../components/ProfilePage';
import withAuth from '../../hoc/withAuth';

// Apply the withAuth HOC to the ProfilePage component
const AuthenticatedProfilePage = withAuth(ProfilePage);

export default AuthenticatedProfilePage;
