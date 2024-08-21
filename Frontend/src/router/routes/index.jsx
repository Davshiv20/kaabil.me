import ProtectedRoute from '@components/ProtectedRoute';
import { 
    LandingPage, 
    DashboardPage, 
    LessonPage, 
    ChapterPage 
} from '@pages';

export const routes = [
    {
        path: "/",
        element: <LandingPage />
    },
    {
        path: "/dashboard",
        element: <ProtectedRoute element={<DashboardPage />} />
    },
    {
        path: "/dashboard/lesson",
        element: <ProtectedRoute element={<LessonPage />} />
    },
    {
        path: "/dashboard/lesson/chapter",
        element: <ProtectedRoute element={<ChapterPage />} />
    }
];
