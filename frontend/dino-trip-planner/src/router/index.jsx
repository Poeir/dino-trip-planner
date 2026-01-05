import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import HomePage from '../pages/homePage';
import TripPlannerPage from '../pages/tripplannerPage';
import RecommendPage from '../pages/recommendPage';
import LoadingPage from '../pages/loadingPage';
import SummaryPage from '../pages/summaryPage';
import ChatbotPage from '../pages/chatbotPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: 'trip-planner',
                element: <TripPlannerPage />
            },
            {
                path: 'recommend',
                element: <RecommendPage />
            },
            {
                path: 'loading',
                element: <LoadingPage />
            },
            {
                path: 'summary',
                element: <SummaryPage />
            },
            {
                path: 'chatbot',
                element: <ChatbotPage />
            }
        ]
    }
]);

export default router;
