import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import HomePage from '../pages/homePage';
import TripPlannerPage from '../pages/trip-planner/tripplannerPage';
import RecommendPage from '../pages/recommendPage';
import LoadingPage from '../pages/loadingPage';
import SummaryPage from '../pages/summaryPage';
import ChatbotPage from '../pages/chatbotPage';
import AboutPage from '../pages/aboutPage';
import PlaceDetailPage from '../pages/placeDetailPage';
import ContactPage from '../pages/contactPage';

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
                path: 'ai-trip',
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
            },
            {
                path : 'about-khonkaen',
                element: <AboutPage />
            },
            {
                path: 'place/:id',
                element: <PlaceDetailPage />
            },
            {
                path : '/contact',
                element: <ContactPage />
            }
        ]
    }
]);

export default router;
